// Shared by the loader and the bake CLI. Validation happens once, outside draw loops.
const fail = (path, message) => { throw new Error(`${path}: ${message}`); };
const require = (ok, path, message) => { if (!ok) fail(path, message); };
const finite = (v, path) => require(Number.isFinite(v), path, "expected a finite number");
const point = (v, path) => require(Array.isArray(v) && v.length === 2 && v.every(Number.isFinite), path, "expected [x,y]");
const list = (v, path) => { require(Array.isArray(v), path, "expected an array"); return v; };
const object = (v, path) => { require(v && typeof v === "object" && !Array.isArray(v), path, "expected an object"); return v; };
const named = (v, path) => require(typeof v === "string" && /^[a-z][\w.:-]*$/i.test(v), path, "invalid name");
const has = (o, k) => Object.hasOwn(o, k);

export function controlInfo(controls, defaults = {}, metadata = {}) {
  object(controls, "controls");
  const out = {};
  for (const [key, raw] of Object.entries(controls)) {
    named(key, `controls.${key}`);
    const def = Array.isArray(raw) ? { ...metadata[key], range: raw } : object(raw, `controls.${key}`);
    point(def.range, `controls.${key}.range`);
    require(def.range[0] < def.range[1], key, "range must increase");
    const value = def.default ?? defaults[key] ?? 0;
    finite(value, `${key}.default`);
    require(def.blend===undefined || ['continuous','discrete'].includes(def.blend),key,'unknown blend policy');
    if(def.blend==='discrete') {
      require(Array.isArray(def.values)&&def.values.length>1&&def.values.every((x,i)=>Number.isFinite(x)&&x>=def.range[0]&&x<=def.range[1]&&(i===0||x>def.values[i-1])),key,'discrete values must increase within range');
      require(def.values.includes(value),key,'default must be a declared drawing identity');
    }
    out[key] = { unit: "number", group: "pose", meaning: "authored", ...def, default: value };
  }
  for (const key of Object.keys(defaults)) require(has(out,key), `defaults.${key}`, "unknown control");
  for (const key of Object.keys(metadata)) require(has(out,key), `controlInfo.${key}`, "unknown control");
  return out;
}

export function validateBaked(data) {
  object(data, "rig");
  require(data.format === 2, "format", `baked format ${data.format} is not supported; rebake it`);
  const controls = controlInfo(data.controls, data.defaults, data.controlInfo);
  const control = (c, path) => require(has(controls,c), path, `unknown control ${c}`);
  object(data.stage, "stage");
  for (const key of ["width","height"]) require(Number.isFinite(data.stage[key]) && data.stage[key] > 0, `stage.${key}`, "expected positive size");
  function terms(ts, path) {
    if (ts === undefined) return;
    for (const [i,t] of list(ts,path).entries()) {
      const p = `${path}[${i}]`;
      if (t.c !== undefined) control(t.c,p);
      if (t.curve) {
        require(t.c !== undefined, p, "curve requires a control");
        let previous = -Infinity;
        require(t.curve.length > 0,p,"empty curve");
        for (const pair of t.curve) { point(pair,p); require(pair[0] > previous,p,"curve keys must increase"); previous = pair[0]; }
      } else finite(t.k,p);
    }
  }
  object(data.parts, "parts");
  for (const [id,part] of Object.entries(data.parts)) for (const [drawing,d] of Object.entries(part)) {
    const p = `parts.${id}.${drawing}`, pts = list(d.points,p);
    require(pts.length > 0 && pts.length % 2 === 0 && pts.every(Number.isFinite),p,"invalid point buffer");
    require(list(d.bones,p).length > 0,p,"no skin bones");
    for (const [fill,rows] of list(d.paths,p)) {
      require(typeof fill === "string",p,"invalid fill");
      for (const [start,length] of list(rows,p)) require(Number.isInteger(start) && Number.isInteger(length) && start >= 0 && length >= 4 && (length-1)%3 === 0 && start+length <= pts.length/2,p,"invalid M/C path row");
    }
    if (d.weights) {
      require(d.weights.length === d.bones.length,p,"skin weights/bones mismatch");
      for (const row of d.weights) require(row.length === pts.length/2 && row.every(w => Number.isFinite(w) && w >= 0 && w <= 1),p,"invalid weights");
      for (let i=0;i<pts.length/2;i++) require(Math.abs(d.weights.reduce((sum,w)=>sum+w[i],0)-1)<.005,p,"weights must sum to one");
    } else require(d.bones.length === 1,p,"multiple bones require weights");
  }
  object(data.views, "views");
  for (const [name,v] of Object.entries(data.views)) {
    const p = `views.${name}`, seen = new Set(), bones = new Map();
    for (const b of list(v.bones,`${p}.bones`)) {
      named(b.name,p); require(!seen.has(b.name),p,`duplicate bone ${b.name}`);
      require(!b.parent || seen.has(b.parent),p,`${b.name}: parent ${b.parent} must precede child`);
      if (b.pivot) point(b.pivot,`${p}.${b.name}.pivot`);
      if (b.scale !== undefined) require(Number.isFinite(b.scale) && b.scale > 0,p,"bone scale must be positive");
      for (const k of ["tx","ty","rot"]) terms(b[k],`${p}.${b.name}.${k}`);
      require(!b.rot?.length || b.pivot,p,`${b.name}: rotation requires a pivot`);
      seen.add(b.name); bones.set(b.name,b);
    }
    const solved = new Set();
    for (const b of bones.values()) if (b.ik) {
      const ik = b.ik, lower = bones.get(ik.lower), end = bones.get(ik.level);
      point(b.pivot,p); point(ik.mid,p); point(ik.end,p);
      require(lower?.parent === b.name,p,`${b.name}: IK lower must be a direct child`);
      require(JSON.stringify(lower.pivot) === JSON.stringify(ik.mid),p,"IK mid must match lower pivot");
      require(!ik.level || (end?.parent === ik.lower && JSON.stringify(end.pivot) === JSON.stringify(ik.end)),p,"IK level must be at the endpoint on a direct child");
      require((b.scale ?? 1) === 1 && (lower.scale ?? 1) === 1 && !lower.tx?.length && !lower.ty?.length,p,"IK links must have unit scale and an untranslated lower joint");
      require(Math.hypot(...ik.mid.map((x,i)=>x-b.pivot[i])) > 0 && Math.hypot(...ik.end.map((x,i)=>x-ik.mid[i])) > 0,p,"IK links need positive length");
      require(ik.bend === undefined || Math.abs(ik.bend) === 1,p,"IK bend must be +/-1");
      for (const k of [b.name,ik.lower,...(ik.level ? [ik.level] : [])]) { require(!solved.has(k),p,`conflicting IK writer ${k}`); solved.add(k); }
      terms(ik.x,p); terms(ik.y,p);
      for (const k of ["extensionMargin","foldMargin"]) if (ik[k] !== undefined) require(Number.isFinite(ik[k]) && ik[k] >= 0,p,"invalid IK margin");
    }
    const pivots = object(v.pivots,`${p}.pivots`);
    for (const [key,value] of Object.entries(pivots)) point(value,`${p}.${key}`);
    for (const [key,value] of Object.entries(v.bias || {})) { control(key,p); finite(value,p); }
    const layers = list(v.layers,`${p}.layers`);
    require(new Set(layers).size === layers.length,p,"duplicate layer");
    for (const id of layers) {
      require(has(data.parts,id),p,`unknown part ${id}`);
      for (const d of Object.values(data.parts[id])) for (const b of d.bones) require(bones.has(b),`${p}.${id}`,`unknown skin bone ${b}`);
    }
    for (const [id,rule] of Object.entries(v.choose || {})) {
      require(layers.includes(id),p,`choice for absent layer ${id}`);
      for (const axis of [rule.rows,...(rule.cols ? [rule.cols] : [])]) {
        control(axis.control,p);
        require(Array.isArray(axis.at) && axis.at.length && axis.at.every((x,i,a)=>Number.isFinite(x) && (!i || x>a[i-1])),p,"lookup axis must increase");
      }
      require(rule.map.length === rule.rows.at.length,p,"lookup row count");
      for (const row of rule.map) {
        require(row.length === (rule.cols?.at.length ?? 1),p,"lookup column count");
        for (const key of row) require(has(data.parts[id],key),p,`unknown drawing ${id}.${key}`);
      }
      if (rule.sets) {
        control(rule.sets.control,p);
        require(Number.isInteger(rule.sets.over) && rule.map[rule.sets.over],p,"drawing set replaces an unknown row");
        for (const row of Object.values(rule.sets.map)) {
          require(row.length === (rule.cols?.at.length ?? 1),p,"drawing set column count");
          for (const key of row) require(has(data.parts[id],key),p,`unknown drawing ${id}.${key}`);
        }
      }
    }
    for (const id of layers) require(v.choose?.[id] || data.parts[id].default,p,`${id}: no default drawing or choice rule`);
    for (const d of v.deformers || []) {
      require(["dome","offset","bow"].includes(d.type),p,`unknown deformer ${d.type}`);
      const ids = d.type === "dome" ? Object.keys(d.depth) : d.parts;
      for (const id of ids) require(layers.includes(id),p,`deformer uses absent layer ${id}`);
      if (d.type === "dome") {
        point(d.center,p); require(d.rx>0 && d.ry>0,p,"dome needs positive radii");
        for (const x of Object.values(d.depth)) finite(x,p);
        require(d.x?.length && d.y?.length,p,"dome needs both channels");
      }
      if (d.type === "bow") { control(d.control,p); finite(d.amount,p); require(d.halfWidth>0,p,"bow needs positive width"); }
      terms(d.x,p); terms(d.y,p);
    }
    for (const [key,a] of Object.entries(v.anchors || {})) {
      require(bones.has(a.bone),`${p}.anchors.${key}`,`unknown bone ${a.bone}`);
      if (typeof a.pivot === "string") require(has(pivots,a.pivot),p,`unknown anchor pivot ${a.pivot}`); else point(a.pivot,p);
      if (a.angle !== undefined) finite(a.angle,p);
      if (a.scale !== undefined) require(Number.isFinite(a.scale) && a.scale>0,p,"anchor scale must be positive");
    }
    const outputs = new Set();
    for (const rule of v.secondary || []) {
      require(rule.into.length && rule.f.length === rule.into.length,p,"secondary frequency count");
      for (const c of rule.into) { control(c,p); require(!outputs.has(c),p,`duplicate secondary writer ${c}`); outputs.add(c); }
      require(rule.f.every(f=>Number.isFinite(f) && f>0),p,"secondary frequency must be positive");
      const zs = Array.isArray(rule.z) ? rule.z : rule.into.map(()=>rule.z);
      require(zs.length === rule.into.length && zs.every(z=>Number.isFinite(z) && z>=0),p,"invalid damping");
      for (const k of ["clamp","outClamp"]) if (rule[k]) { point(rule[k],p); require(rule[k][0]<=rule[k][1],p,"invalid clamp"); }
      for (const input of rule.input) {
        finite(input.gain,p);
        require([input.vel,input.control,input.rate].filter(Boolean).length === 1,p,"secondary input needs one source");
        if (input.vel) {
          const [bone,pv] = input.vel;
          require(bones.has(bone) && (has(pivots,pv) || has(pivots,`h.${pv}`) || has(pivots,`b.${pv}`)),p,"unknown secondary point");
          require(input.axis === 0 || input.axis === 1,p,"point axis must be 0 or 1");
        } else if (input.control) control(input.control,p);
        else for (const c of input.rate) control(c,p);
      }
    }
  }
  return data;
}
