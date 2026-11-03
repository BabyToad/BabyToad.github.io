import * as THREE from 'three';
import { projection,shadowWitness } from '../../../src/stage/projection.js';
import { bitmapGrid } from '../../../src/stage/bitmap-skin.js';
import { smooth } from '../../../src/math.js';
import { paintFigure } from './figure-paint.js';

/** Shrine-specific WebGL adapter. World surfaces are real geometry. The reference
 * camera is locked: one painting is not enough evidence for a free 3D camera.
 * The debug camera deliberately exposes the proxy, rather than faking scenery.
 */
export async function createStage(canvas,config,manifest,performance,assetURL) {
  const p=projection(config),scene=new THREE.Scene();
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
  renderer.setPixelRatio(1);renderer.setSize(p.width,p.height,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
  // Only re-render shadow maps when pose/light/placement changes, never on each rAF.
  renderer.shadowMap.autoUpdate=false;
  const camera=new THREE.PerspectiveCamera(); camera.position.set(0,p.h,0);
  camera.near=.1;camera.far=100;
  camera.projectionMatrix.makePerspective(-p.cx*.1/p.f,(p.width-p.cx)*.1/p.f,p.cy*.1/p.f,-(p.height-p.cy)*.1/p.f,.1,100);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();camera.updateMatrixWorld();
  const debugCamera=new THREE.PerspectiveCamera(48,p.width/p.height,.1,100);
  debugCamera.position.set(9,7,0);debugCamera.lookAt(2,1.8,-12);
  const loader=new THREE.TextureLoader(),resources=[];
  async function texture(path) {
    if(!path)return null;
    const t=await loader.loadAsync(new URL(path,assetURL).href);t.colorSpace=THREE.SRGBColorSpace;
    t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());resources.push(t);return t;
  }
  const [plate,master,originalStudy]=await Promise.all([texture(manifest.plateFile??'plate.png'),texture(manifest.master),texture(manifest.originalStudy)]);
  const lifeAssets=await (await fetch(new URL('life/manifest.json',assetURL))).json();
  const repair=await texture(`life/${lifeAssets.ribbonPlate.path}`);
  // Reveal supplied clean-plate pixels only under the old ribbon. Do this once,
  // before any render: receivers and backdrop share the same repaired painting.
  const plateCanvas=document.createElement('canvas');plateCanvas.width=p.width;plateCanvas.height=p.height;
  const plateContext=plateCanvas.getContext('2d');plateContext.drawImage(plate.image,0,0);
  plateContext.drawImage(repair.image,...lifeAssets.ribbonPlate.bounds);plate.image=plateCanvas;plate.needsUpdate=true;
  const backdrop=new THREE.Group(),surfaces=new THREE.Group(),objects=new THREE.Group(),debug=new THREE.Group();
  scene.add(backdrop,surfaces,objects,debug);debug.visible=false;
  function geometry(points,uv,indices) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();g.computeBoundingSphere();resources.push(g);return g;
  }
  const quadIndices=[0,2,1,0,3,2];
  function screenPolygon(pixels,project) {
    return geometry(pixels.map(project),pixels.flatMap(([x,y])=>[x/p.width,1-y/p.height]),quadIndices);
  }
  function basic(map,extra={}) {
    const m=new THREE.MeshBasicMaterial({map,side:THREE.DoubleSide,toneMapped:false,...extra});resources.push(m);return m;
  }
  function projected(map) {
    const material=basic(map),reference=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    // Ordinary UV interpolation stretches a photograph over a slanted plane.
    // Interpolate homogeneous projector coordinates, THEN divide per fragment.
    material.onBeforeCompile=shader=>{
      shader.uniforms.referenceCamera={value:reference};
      shader.vertexShader='uniform mat4 referenceCamera; varying vec4 paintedPosition;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',
        '#include <project_vertex>\npaintedPosition = referenceCamera * modelMatrix * vec4(transformed, 1.0);');
      shader.fragmentShader='varying vec4 paintedPosition;\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',
        'diffuseColor *= texture2D(map, paintedPosition.xy / paintedPosition.w * 0.5 + 0.5);');
    };
    material.customProgramCacheKey=()=> 'dalang-projector-v1';return material;
  }
  const full=[[0,0],[p.width,0],[p.width,p.height],[0,p.height]];
  const back=new THREE.Mesh(screenPolygon(full,q=>p.atDepth(q,45)),basic(plate));backdrop.add(back);
  // Same registered image UVs on receiver planes: reference-view reprojection is exact.
  const wallPixels=[[config.wall.left,120],[config.wall.right,120],
    [config.wall.right,p.wallY(config.wall.right)],[config.wall.left,p.wallY(config.wall.left)]];
  const floorPixels=[[0,p.wallY(0)],[p.width,p.wallY(p.width)],[p.width,p.height],[0,p.height]];
  const receivers=[],bases=[];
  for(const [name,pixels,plane,color] of [['wall',wallPixels,p.wall,0xcca978],['floor',floorPixels,p.floor,0x7e9690]]) {
    const g=screenPolygon(pixels,q=>p.onPlane(q,plane));
    // A colour surface and a coplanar shadow-only pass preserve the painting's
    // original colour. Polygon offset belongs to the overlay, not the world.
    const base=new THREE.Mesh(g,projected(plate));base.userData.painted=base.material;
    base.userData.plain=basic(null,{color});bases.push(base);surfaces.add(base);
    const sm=new THREE.ShadowMaterial({color:0x292232,opacity:config.light.opacity,side:THREE.DoubleSide,
      polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,depthWrite:false});resources.push(sm);
    const receiver=new THREE.Mesh(g,sm);receiver.receiveShadow=true;receiver.renderOrder=1;surfaces.add(receiver);receivers.push(receiver);
    const dm=new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,wireframe:true});resources.push(dm);
    const wire=new THREE.Mesh(g,dm);wire.userData.surface=name;debug.add(wire);
  }
  const light=new THREE.DirectionalLight(0xffffff,1),target=new THREE.Vector3(3,1.8,-11);
  const lightDirection=new THREE.Vector3(...config.light.direction).normalize();
  light.position.copy(target).addScaledVector(lightDirection,-22);light.target.position.copy(target);
  light.castShadow=true;light.shadow.mapSize.set(config.light.mapSize,config.light.mapSize);
  Object.assign(light.shadow.camera,{left:-5,right:5,top:5.5,bottom:-4.5,near:1,far:45});
  light.shadow.bias=-.00008;light.shadow.normalBias=.006;
  scene.add(light,light.target);
  const lightHelper=new THREE.DirectionalLightHelper(light,1);debug.add(lightHelper);
  const axes=new THREE.AxesHelper(2);axes.position.set(0,0,-12);debug.add(axes);
  // Registered, authored proxy volumes for the fixed beam and brace. The
  // painting supplies their visible surfaces; these volumes only block light.
  // They remain visible as wire geometry in the inspection camera.
  const structure=new THREE.Group();scene.add(structure);
  for(const def of config.structure || []) {
    const front=def.vertices.map(([x,y,depth])=>depth==='wall'
      ? p.onPlane([x,y],p.wall).map((v,i)=>i===2?v+.025:v)
      : p.atDepth([x,y],depth));
    const points=[...front,...front.map(q=>[q[0],q[1],q[2]+def.thickness])],n=front.length;
    const indices=[...def.triangles,...def.triangles.map(i=>i+n)];
    for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,j+n,i,j+n,i+n);}
    const g=geometry(points,points.flatMap(()=>[0,0]),indices);
    const caster=new THREE.Mesh(g,basic(null,{colorWrite:false,depthWrite:false}));
    caster.name=def.id;caster.castShadow=true;structure.add(caster);
    const wire=new THREE.Mesh(g,basic(null,{color:0xffc466,wireframe:true,depthTest:false}));debug.add(wire);
  }
  function cutGeometry(bounds,depth) {
    const [x,y,w,h]=bounds;
    return geometry([[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(q=>p.atDepth(q,depth)),[0,1,1,1,1,0,0,0],quadIndices);
  }
  const cuts=await Promise.all(Object.entries(manifest.cuts).map(async([id,entry])=>[id,{...entry,map:await texture(`${id}.png`)}]));
  const cutMap=new Map(cuts),occluders=[];
  const registration=await (await fetch(new URL('../../art/round3/HAND_REGISTRATION.json',assetURL))).json();
  const hands=new Map(await Promise.all(['cup-back','cup-palm','cup-fingers','open-back','open-palm','open-fingers'].map(async name=>[name,(await texture(`../../art/round3/hands/${name}.png`)).image])));
  for(const def of config.occluders) {
    if(def.id==='ribbon')continue; // one skinned copy, never a second static ribbon
    const cut=cutMap.get(def.id),depth=def.id==='bowl'?performance.offering.depth:def.depth ?? p.depthAtFloor(def.foot);
    // Fixed-camera occlusion cards reproduce registered master pixels. Moving
    // skins keep linear filtering; static pixel-aligned cards use nearest.
    cut.map.magFilter=THREE.NearestFilter;cut.map.minFilter=THREE.NearestFilter;
    cut.map.generateMipmaps=false;cut.map.anisotropy=1;cut.map.needsUpdate=true;
    const mesh=new THREE.Mesh(cutGeometry(cut.bounds,depth),basic(cut.map,{alphaTest:.5}));
    mesh.name=def.id;objects.add(mesh);occluders.push(mesh);
    if(['bowl','frog','stool','sack','basin','board','spout'].includes(def.id)){mesh.castShadow=true;mesh.customDepthMaterial=new THREE.MeshDepthMaterial({map:cut.map,alphaTest:.5,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});resources.push(mesh.customDepthMaterial);}
  }
  // Registered patches replace interior brush marks, not the painted silhouette.
  // Keep surface before stream and attach each patch to its original object's
  // depth. Both remain ray-transparent; their parent prop owns the click.
  const water=[];
  for(const id of ['surface','stream']){
    const spec=lifeAssets.water[id],maps=await Promise.all(spec.frames.map(path=>texture(`life/${path}`)));
    const def=config.occluders.find(x=>x.id===(id==='surface'?'basin':'stream'));
    const depth=def.depth??p.depthAtFloor(def.foot);
    const mesh=new THREE.Mesh(cutGeometry([...spec.placement,...spec.size],depth),basic(maps[0],{
      transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));
    mesh.renderOrder=id==='surface'?2:3;objects.add(mesh);water.push({mesh,maps,fps:spec.fps,index:0});
  }
  const ribbonCut=cutMap.get('ribbon'),ribbonView=performance.life.ribbon.views.default;
  const ribbonGrid=bitmapGrid(ribbonView,{bounds:ribbonCut.bounds,bones:['root','ribbon','tip'],columns:12,rows:36,
    weight(_x,y){const a=smooth((y-115)/25),b=smooth((y-200)/35);return [1-a,a*(1-b),a*b];}});
  const ribbonGeo=geometry(Array(ribbonGrid.drawing.points.length/2).fill([0,0,0]),ribbonGrid.uv,ribbonGrid.indices);
  const ribbon=new THREE.Mesh(ribbonGeo,basic(ribbonCut.map,{alphaTest:.35,transparent:true,depthWrite:true}));
  ribbon.name='ribbon';ribbon.castShadow=true;objects.add(ribbon);
  ribbon.customDepthMaterial=new THREE.MeshDepthMaterial({map:ribbonCut.map,alphaTest:.35,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});resources.push(ribbon.customDepthMaterial);
  const bellCut=cutMap.get('bell'),bellView=performance.bell.views.default;
  const grid=bitmapGrid(bellView,{bounds:bellCut.bounds,bones:['root','rope','bell'],columns:24,rows:64,
    weight(_x,y){const a=smooth((y-216)/28),b=smooth((y-265)/38);return [1-a,a*(1-b),a*b];}});
  const bellGeo=geometry(Array(grid.drawing.points.length/2).fill([0,0,0]),grid.uv,grid.indices);
  // Straight alpha blending keeps the opaque backplate's alpha at one. With this
  // Three/Chromium combination, alpha-to-coverage left fractional framebuffer
  // alpha and inflated RGB during canvas export despite renderer alpha:false.
  const bell=new THREE.Mesh(bellGeo,basic(bellCut.map,{alphaTest:.35,transparent:true,depthWrite:true}));bell.name='bell';bell.castShadow=true;objects.add(bell);
  bell.customDepthMaterial=new THREE.MeshDepthMaterial({map:bellCut.map,alphaTest:.35,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});resources.push(bell.customDepthMaterial);
  const rig=performance.rig;
  const {home:feet}=performance.space;
  // Vector curves are rasterized at their source resolution every simulation tick.
  // This avoids a second curve tessellator; the texture is bounded, not DPR-sized.
  const ink=document.createElement('canvas');ink.width=rig.stage.width;ink.height=rig.stage.height;
  const ctx=ink.getContext('2d'),inkTexture=new THREE.CanvasTexture(ink);inkTexture.colorSpace=THREE.SRGBColorSpace;resources.push(inkTexture);
  const figureGeo=geometry(Array(4).fill([0,0,0]),[0,1,1,1,1,0,0,0],quadIndices);
  const figure=new THREE.Mesh(figureGeo,basic(inkTexture,{alphaTest:.3,transparent:true,depthWrite:true}));figure.name='saint';figure.castShadow=true;objects.add(figure);
  // Short-range ambient occlusion at each evaluated sole supplements the one
  // directional light. It lives on the floor, disappears in a hop and cannot
  // darken her face. It is an explicit contact approximation, not another sun.
  const contactCanvas=document.createElement('canvas');contactCanvas.width=contactCanvas.height=64;
  const contactContext=contactCanvas.getContext('2d'),gradient=contactContext.createRadialGradient(32,32,2,32,32,32);
  gradient.addColorStop(0,'rgba(41,34,50,.82)');gradient.addColorStop(.45,'rgba(41,34,50,.4)');gradient.addColorStop(1,'rgba(41,34,50,0)');
  contactContext.fillStyle=gradient;contactContext.fillRect(0,0,64,64);
  const contactMap=new THREE.CanvasTexture(contactCanvas);contactMap.colorSpace=THREE.SRGBColorSpace;resources.push(contactMap);
  const contactGeo=new THREE.PlaneGeometry(.44,.28);resources.push(contactGeo);
  const contacts=[0,1].map(()=>{const mesh=new THREE.Mesh(contactGeo,basic(contactMap,{transparent:true,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.renderOrder=2;objects.add(mesh);return mesh;});
  figure.customDepthMaterial=new THREE.MeshDepthMaterial({map:inkTexture,alphaTest:.3,depthPacking:THREE.RGBADepthPacking,side:THREE.DoubleSide});resources.push(figure.customDepthMaterial);
  const gridDebug=new THREE.Mesh(bellGeo,new THREE.MeshBasicMaterial({color:0x00eeff,wireframe:true,depthTest:false}));resources.push(gridDebug.material);debug.add(gridDebug);
  const cordGeo=new THREE.CylinderGeometry(.014,.014,1,6);resources.push(cordGeo);
  const cord=new THREE.Mesh(cordGeo,basic(null,{color:0xd6a943}));cord.name='cord';cord.castShadow=true;objects.add(cord);
  const grainGeo=new THREE.SphereGeometry(.018,5,3);resources.push(grainGeo);
  const grainMaterial=basic(null,{color:0xffefca}),grainMeshes=[];
  const raycaster=new THREE.Raycaster();
  let mode='live',shadows=true,lastTick=-1,figureFoot=feet,draws=0;
  function update() {
    const tick=performance.scene.tick;if(tick===lastTick)return;lastTick=tick;
    const [rX,rY]=ribbonGrid.evaluate(performance.life.pose),rPos=ribbonGeo.attributes.position;
    for(let i=0;i<rX.length;i++)rPos.setXYZ(i,...p.atDepth([rX[i],rY[i]],performance.life.depth));
    rPos.needsUpdate=true;ribbonGeo.computeVertexNormals();ribbonGeo.computeBoundingSphere();
    for(const track of water){track.index=Math.floor(tick*track.fps/24)%track.maps.length;track.mesh.material.map=track.maps[track.index];}
    const [X,Y]=grid.evaluate(performance.bellPose),pos=bellGeo.attributes.position;
    for(let i=0;i<X.length;i++)pos.setXYZ(i,...p.atDepth([X[i],Y[i]],config.bell.depth));
    pos.needsUpdate=true;bellGeo.computeVertexNormals();bellGeo.computeBoundingSphere();
    ctx.clearRect(0,0,ink.width,ink.height);paintFigure(ctx,performance,hands,registration,cutMap.get('bowl'));inkTexture.needsUpdate=true;
    figureFoot=performance.root;
    const positions=figureGeo.attributes.position;
    for(const [i,[x,y]] of [[0,0],[ink.width,0],[ink.width,ink.height],[0,ink.height]].entries())
      positions.setXYZ(i,...performance.characterFrame.world([x,y]));
    positions.needsUpdate=true;figureGeo.computeVertexNormals();figureGeo.computeBoundingSphere();
    [['footL',[255.3,1115.5]],['footR',[459.5,1116.9]]].forEach(([bone,q],i)=>{
      const foot=performance.characterFrame.world(performance.rig.views.front.point(performance.actor.pose,bone,q));
      const height=Math.max(0,foot[1]);contacts[i].position.set(foot[0],.006,foot[2]);
      contacts[i].material.opacity=Math.exp(-height*12);contacts[i].scale.setScalar(1+Math.min(.5,height));
    });
    const bowl=occluders.find(x=>x.name==='bowl');
    bowl.visible=!performance.bowl.held;
    const [bx,by,bw,bh]=cutMap.get('bowl').bounds,anchor=performance.offering.anchor,basis=performance.bowl.basis;
    for(const [i,q] of [[bx,by],[bx+bw,by],[bx+bw,by+bh],[bx,by+bh]].entries()){
      const dx=(q[0]-anchor[0])*performance.offering.depth/p.f,dy=(anchor[1]-q[1])*performance.offering.depth/p.f;
      bowl.geometry.attributes.position.setXYZ(i,performance.bowl.position[0]+basis[0]*dx+basis[2]*dy,
        performance.bowl.position[1]+basis[1]*dx+basis[3]*dy,performance.bowl.position[2]);
    }
    bowl.geometry.attributes.position.needsUpdate=true;bowl.geometry.computeVertexNormals();bowl.geometry.computeBoundingSphere();
    occluders.find(x=>x.name==='frog').position.fromArray(performance.frogOffset);
    // One straight cord at the same pixels, drawn behind every place she stands and in front of the wall.
    const behind=q=>new THREE.Vector3(...p.atDepth(p.project(q),11.95)),top=behind(performance.cord.top),bottom=behind(performance.cord.bottom);
    cord.position.copy(top).add(bottom).multiplyScalar(.5);cord.scale.y=top.distanceTo(bottom);
    cord.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),top.clone().sub(bottom).normalize());
    while(grainMeshes.length<performance.grains.length){const grain=new THREE.Mesh(grainGeo,grainMaterial);grain.castShadow=true;objects.add(grain);grainMeshes.push(grain);}
    grainMeshes.forEach((mesh,i)=>{mesh.visible=i<performance.grains.length;});
    performance.grains.forEach((grain,i)=>{grainMeshes[i].position.fromArray(grain.position);grainMeshes[i].scale.setScalar(Math.min(1,(240-(tick-grain.born))/24));});
    renderer.shadowMap.needsUpdate=true;
  }
  function render() {
    update();
    const reference=mode==='study'||mode==='original';
    back.material.map=mode==='study'&&master||mode==='original'&&originalStudy||plate;
    surfaces.visible=!reference&&mode!=='proxy';objects.visible=!reference&&mode!=='plate';backdrop.visible=mode!=='proxy'&&mode!=='shadows';
    structure.visible=!reference&&mode!=='plate';
    for(const base of bases)base.material=mode==='shadows'?base.userData.plain:base.userData.painted;
    debug.visible=mode==='proxy';scene.background=(mode==='proxy'||mode==='shadows')?new THREE.Color('#182426'):null;
    receivers.forEach(m=>m.visible=shadows&&mode!=='plate');contacts.forEach(m=>m.visible=shadows);
    renderer.render(scene,mode==='proxy'?debugCamera:camera);draws++;
  }
  function pick(x,y) {
    if(mode!=='live')return null;
    raycaster.setFromCamera(new THREE.Vector2(x/p.width*2-1,1-y/p.height*2),camera);
    // Raycaster doesn't know texture alpha. Read the texture at the hit UV, so
    // transparent corners never block a farther prop or count as a bell click.
    for(const hit of raycaster.intersectObjects([...occluders.filter(x=>x.visible),bell,ribbon,figure,cord])) {
      if(hit.object===cord)return 'bell';
      const map=hit.object.material.map,im=map.image;
      let pixels=map.userData.pick;
      if(!pixels || map===inkTexture) {const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(im,0,0);pixels=cx.getImageData(0,0,c.width,c.height);map.userData.pick=pixels;}
      const u=Math.min(pixels.width-1,Math.max(0,Math.floor(hit.uv.x*pixels.width))),v=Math.min(pixels.height-1,Math.max(0,Math.floor((1-hit.uv.y)*pixels.height)));
      if(pixels.data[(v*pixels.width+u)*4+3]>127)return hit.object.name;
    }
    return null;
  }
  return {render,pick,projection:p,renderer,performance,scene,camera,
    setMode(value){if(!['live','study','original','proxy','shadows','plate'].includes(value))throw Error('Unknown stage mode');mode=value;renderer.shadowMap.needsUpdate=true;},
    setShadows(value){shadows=!!value;},
    get info(){const bellPoint=p.atDepth(bellView.point(performance.bellPose,'bell',[875,350]),config.bell.depth);
      return {mode,tick:lastTick,draws,figureFoot:[...figureFoot],bell:performance.bellPose,
      action:performance.action?.kind||null,bowl:performance.bowl,contact:performance.scene.trace.filter(x=>['projected-grip','catch','grip-missed'].includes(x.kind)).at(-1),
      bellShadow:p.project(shadowWitness(p,bellPoint,config.light.direction).point),
      structure:(config.structure||[]).map(x=>x.id),water:water.map(x=>x.index),ribbon:performance.life.pose,
      contacts:contacts.map(x=>({position:x.position.toArray(),opacity:x.material.opacity})),
      triangles:renderer.info.render.triangles,textureSize:[ink.width,ink.height],plate:manifest.plate};},
    dispose(){for(const item of resources)item.dispose();light.shadow.dispose();renderer.dispose();}};
}
