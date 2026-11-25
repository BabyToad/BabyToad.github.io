// Reuse the site's existing, licensed Three.js distribution. No CDN/build tooling.
import * as THREE from '../../../six-springs/lib/three.module.js';

export function createTurntable(host, action, onLost) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Keep the last still frame across compositor captures while the render loop sleeps.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);
  const world = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, .1, 50);
  camera.position.set(5.8, 8.5, 8.8); camera.lookAt(-.5, 0, 0);
  world.add(new THREE.AmbientLight(0xffffff, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-3, 8, 4); light.castShadow = true;
  light.shadow.mapSize.set(1024,1024); light.shadow.camera.left = -7; light.shadow.camera.right = 7;
  light.shadow.camera.top = 6; light.shadow.camera.bottom = -6; light.shadow.bias = -.001;
  world.add(light);
  const materials = {};
  for (const key of ['body','edge','ink','soft','accent','disc','mat']) materials[key] = new THREE.MeshStandardMaterial({ roughness: .85, metalness: key === 'edge' ? .4 : .05 });
  const meshes = [];
  function mesh(geometry, material, parent = world, x = 0, y = 0, z = 0) {
    const item = new THREE.Mesh(geometry, material); item.position.set(x,y,z);
    item.castShadow = true; item.receiveShadow = true; parent.add(item); meshes.push(item); return item;
  }
  function box(w,h,d,mat,parent,x,y,z) { return mesh(new THREE.BoxGeometry(w,h,d), mat,parent,x,y,z); }
  function cylinder(radius,h,mat,parent,x,y,z) { return mesh(new THREE.CylinderGeometry(radius,radius,h,96),mat,parent,x,y,z); }
  const floor = mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({ opacity: .15 }),world,0,-.38,0);
  floor.rotation.x = -Math.PI/2; floor.castShadow = false;
  const deck = new THREE.Group(); deck.position.x = .65; world.add(deck);
  box(5.1,.42,3.7,materials.body,deck,0,0,0);
  box(4.98,.055,3.57,materials.edge,deck,0,.23,0);
  box(4.91,.04,3.5,materials.body,deck,0,.275,0);
  for(const x of [-2,2]) for(const z of [-1.4,1.4]) cylinder(.22,.22,materials.ink,deck,x,-.27,z);
  const platterX = -.65;
  cylinder(1.48,.15,materials.edge,deck,platterX,.37,0);
  cylinder(1.4,.055,materials.mat,deck,platterX,.47,0);
  // Machined strobe marks, still unless an actual record is playing.
  for(let i=0;i<64;i++) {
    const angle = i/64*Math.PI*2;
    const dot=box(.035,.03,.06,materials.soft,deck,platterX+Math.cos(angle)*1.455,.39,Math.sin(angle)*1.455);
    dot.rotation.y=-angle;
  }
  const record = new THREE.Group(); world.add(record);
  const disc=cylinder(1.34,.035,materials.disc,record,0,0,0); disc.userData.action='record';
  const grooveMat=new THREE.LineBasicMaterial({color:0x555555,transparent:true,opacity:.35});
  for(let r=.49;r<1.3;r+=.027) {
    const points=[]; for(let i=0;i<128;i++) points.push(new THREE.Vector3(Math.cos(i/128*Math.PI*2)*r,.02,Math.sin(i/128*Math.PI*2)*r));
    const line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),grooveMat); record.add(line);
  }
  const label=cylinder(.43,.039,materials.accent,record,0,.007,0);
  const labelCanvas=document.createElement('canvas'); labelCanvas.width=labelCanvas.height=512;
  const labelTexture=new THREE.CanvasTexture(labelCanvas); labelTexture.colorSpace=THREE.SRGBColorSpace;
  const labelFace=mesh(new THREE.CircleGeometry(.415,64),new THREE.MeshBasicMaterial({map:labelTexture}),record,0,.028,0);
  labelFace.rotation.x=-Math.PI/2;
  cylinder(.055,.1,materials.edge,deck,platterX,.55,0);
  const sleeve = new THREE.Group(); sleeve.position.set(-3.15,.12,-.15); sleeve.rotation.set(-.2,.13,-.08); world.add(sleeve);
  box(2.45,.05,2.45,materials.body,sleeve,0,0,0);
  const sleeveMat = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
  const coverFace=mesh(new THREE.PlaneGeometry(2.4,2.4),sleeveMat,sleeve,0,.032,0);
  coverFace.rotation.x=-Math.PI/2; coverFace.userData.action='record';
  const arm=new THREE.Group(); arm.position.set(1.78,.56,-1.1); deck.add(arm);
  cylinder(.22,.16,materials.edge,arm,0,0,0);
  cylinder(.13,.28,materials.ink,arm,0,.06,0);
  function rod(a,b,r,mat,parent) {
    const direction=new THREE.Vector3().subVectors(b,a);
    const item=mesh(new THREE.CylinderGeometry(r,r,direction.length(),16),mat,parent);
    item.position.copy(a).add(b).multiplyScalar(.5); item.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize()); item.userData.action='arm'; return item;
  }
  rod(new THREE.Vector3(0,.2,0),new THREE.Vector3(-.12,.2,1.65),.045,materials.edge,arm);
  rod(new THREE.Vector3(-.12,.2,1.65),new THREE.Vector3(-.4,.12,1.96),.045,materials.edge,arm);
  const cartridge=box(.16,.12,.29,materials.ink,arm,-.4,.08,1.96); cartridge.userData.action='arm';
  cylinder(.14,.3,materials.ink,arm,0,.2,-.3).rotation.x=Math.PI/2;
  const cueHit=box(.65,.7,2.6,new THREE.MeshBasicMaterial({visible:false}),arm,-.12,.2,.7); cueHit.userData.action='arm';
  const led=cylinder(.055,.02,materials.accent,deck,1.9,.32,1.4);
  box(.38,.06,.18,materials.ink,deck,1.45,.32,1.4);
  const loader=new THREE.TextureLoader(), textures=new Map();
  let state={}, frame=0, disposed=false, visible=true, last=0, progress=0, cueProgress=0, drag, settle;
  const from=new THREE.Vector3(-2.9,.27,-.05), to=new THREE.Vector3(platterX+deck.position.x,.53,0);
  const ray=new THREE.Raycaster(); const pointer=new THREE.Vector2();
  function pick(event) {
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    ray.setFromCamera(pointer,camera);
    return ray.intersectObjects([disc,coverFace,cartridge,cueHit],true)[0]?.object.userData.action;
  }
  function down(event) {
    if(event.button!==0) return;
    const hit=pick(event); if(!hit)return;
    if (hit === 'record' && state.placed) return;
    drag={hit,x:event.clientX,y:event.clientY,startArm:cueProgress};
    renderer.domElement.setPointerCapture(event.pointerId); host.classList.add('is-dragging');
  }
  function move(event) {
    if (!drag || (Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<6&&!drag.position&&drag.arm===undefined)) return;
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    ray.setFromCamera(pointer,camera);
    if (drag.hit==='record') {
      const point=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-.9),new THREE.Vector3());
      if(point) drag.position=point.clamp(new THREE.Vector3(-4,.9,-2),new THREE.Vector3(3,.9,2));
    } else drag.arm=THREE.MathUtils.clamp(drag.startArm+(drag.x-event.clientX)/rect.width*3,0,1);
    schedule();
  }
  function up(event) {
    if(!drag)return;
    const held=drag;
    const rect=renderer.domElement.getBoundingClientRect();
    const inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
    const tapped=!held.position&&held.arm===undefined;
    const recordDrop=held.position&&Math.hypot(held.position.x-to.x,held.position.z-to.z)<1.7;
    const armDrop=held.arm!==undefined&&(held.arm>=.5)!==Boolean(state.cued);
    cancel();
    if(inside&&(tapped||(held.hit==='record'?recordDrop:armDrop)))action(held.hit);
  }
  function cancel() {
    if(drag?.position)settle={from:record.position.clone(),progress:0};
    if(drag?.arm!==undefined)cueProgress=drag.arm;
    drag=null; host.classList.remove('is-dragging'); schedule();
  }
  renderer.domElement.addEventListener('pointerdown',down);
  renderer.domElement.addEventListener('pointerup',up);
  renderer.domElement.addEventListener('pointermove',move);
  renderer.domElement.addEventListener('pointercancel',cancel);
  function drawLabel() {
    const context=labelCanvas.getContext('2d'), css=getComputedStyle(document.documentElement);
    context.fillStyle=css.getPropertyValue('--accent').trim(); context.fillRect(0,0,512,512);
    context.fillStyle=css.getPropertyValue('--accent-ink').trim(); context.textAlign='center';
    context.font='24px monospace'; context.fillText('AKNB · SIDE A',256,100);
    context.font='bold 26px monospace';
    const artist=(state.album?.artist||'RECORDS').toUpperCase();
    context.fillText(artist,256,170,400);
    context.font='20px monospace'; context.fillText(state.album?.year||'',256,365);
    context.beginPath(); context.arc(256,256,13,0,Math.PI*2); context.fill();
    labelTexture.needsUpdate=true;
  }
  function theme() {
    const css=getComputedStyle(document.documentElement), color=token=>css.getPropertyValue(token).trim();
    materials.body.color.set(color('--bg-raised')); materials.edge.color.set(color('--border-strong'));
    materials.ink.color.set(color('--ink')); materials.soft.color.set(color('--ink-soft'));
    materials.accent.color.set(color('--accent')); materials.disc.color.set('#181614');
    materials.mat.color.set(color('--bg-dip')); grooveMat.color.set(color('--ink-soft'));
    drawLabel(); schedule();
  }
  function schedule() { if(!frame&&!disposed&&visible&&!document.hidden)frame=requestAnimationFrame(render); }
  function render(time) {
    frame=0; const dt=Math.min((time-last)/1000||.016,.05); last=time;
    const target=state.placed?1:0, armTarget=state.cued?1:0;
    progress=reduced.matches?target:THREE.MathUtils.damp(progress,target,7,dt);
    cueProgress=reduced.matches?armTarget:THREE.MathUtils.damp(cueProgress,armTarget,8,dt);
    if(Math.abs(progress-target)<.001)progress=target;
    if(Math.abs(cueProgress-armTarget)<.001)cueProgress=armTarget;
    record.position.lerpVectors(from,to,progress); record.position.y+=Math.sin(progress*Math.PI)*.85;
    if(settle) {
      settle.progress=reduced.matches?1:Math.min(1,settle.progress+dt*3);
      const eased=THREE.MathUtils.smoothstep(settle.progress,0,1);
      record.position.lerpVectors(settle.from,state.placed?to:from,eased);
      record.position.y+=Math.sin(eased*Math.PI)*.15;
      if(settle.progress===1){settle=null;progress=target;}
    }
    record.rotation.z=Math.sin(progress*Math.PI)*.15;
    if(drag?.position) record.position.copy(drag.position);
    if(state.playing&&!reduced.matches) record.rotation.y-=dt*Math.PI*2*(33.333/60);
    arm.rotation.y=-cueProgress*.65; arm.position.y=.56+(1-cueProgress)*.09;
    if(drag?.arm!==undefined) arm.rotation.y=-drag.arm*.65;
    led.scale.setScalar(state.playing?1.2:1);
    renderer.render(world,camera);
    if(settle||progress!==target||cueProgress!==armTarget||(state.playing&&!reduced.matches))schedule();
  }
  function resize() {
    const w=host.clientWidth,h=host.clientHeight,aspect=w/h;
    renderer.setSize(w,h,false);
    const width=Math.max(8.6,5.4*aspect); camera.left=-width/2; camera.right=width/2;
    camera.top=width/aspect/2; camera.bottom=-camera.top; camera.updateProjectionMatrix(); schedule();
  }
  const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(host);
  const themeObserver=new MutationObserver(theme); themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}}); intersection.observe(host);
  document.addEventListener('visibilitychange',schedule); reduced.addEventListener('change',schedule);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();disposed=true;cancelAnimationFrame(frame);renderer.domElement.hidden=true;onLost();});
  theme(); resize();
  return {
    setState(next) {
      const changed=state.album?.id!==next.album.id; state=next;
      if(changed) {
        drag=null; settle=null; host.classList.remove('is-dragging');
        record.rotation.y=0; drawLabel();
        const id=next.album.id;
        if(textures.has(id)) sleeveMat.map=textures.get(id);
        else loader.load(next.album.cover,texture=>{
          if(disposed){texture.dispose();return;}
          texture.colorSpace=THREE.SRGBColorSpace;textures.set(id,texture);
          if(state.album.id===id){sleeveMat.map=texture;sleeveMat.needsUpdate=true;schedule();}
        });
        sleeveMat.needsUpdate=true;
      }
      schedule();
    },
    dispose() {
      disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();themeObserver.disconnect();intersection.disconnect();
      document.removeEventListener('visibilitychange',schedule);reduced.removeEventListener('change',schedule);
      world.traverse(object=>{object.geometry?.dispose();});
      new Set(meshes.map(item=>item.material)).forEach(material=>material.dispose());
      grooveMat.dispose();labelTexture.dispose();textures.forEach(texture=>texture.dispose());renderer.dispose();
    }
  };
}
