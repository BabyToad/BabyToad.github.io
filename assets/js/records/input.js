import { TAU } from './physics/dsp.js';
import { PIVOT_X, PIVOT_Y, R_DISC, R_LABEL, alphaForRadius } from './physics/geometry.js';

export function connectGestures({ canvas, renderer, fan, camera, getState, command, select, hover, invalidate }) {
  const pointers = new Map();
  let drag = null, pendingTap = null;

  const angle = p => {
    const a = Math.atan2(p[1] - PIVOT_Y, p[0] - PIVOT_X);
    return a < 0 ? a + TAU : a;
  };
  const inBox = (p, x0, y0, x1, y1) => p && p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;

  function pickSleeve(x, y) {
    const cam = renderer.cam;
    if (!cam) return null;
    let depth = renderer.pickDisc(x, y, getState().recordMatrix) ?? Infinity;
    for (const z of [0, -.019, .018]) {
      const p = renderer.pick(x, y, z);
      if (!p) continue;
      const blocked = z === 0
        ? Math.hypot(...p) < .1645
        : z === -.019
          ? inBox(p, -.185, -.19, .27, .19)
          : renderer.armDistance(p, getState().al) < .014;
      if (blocked) {
        depth = Math.min(
          depth,
          (p[0] - cam.eye[0]) * cam.fwd[0] + (p[1] - cam.eye[1]) * cam.fwd[1] + (z - cam.eye[2]) * cam.fwd[2]
        );
      }
    }
    return fan.pick(x, y, depth);
  }

  function inspectTarget(x, y, pointerType = 'mouse') {
    const state = getState();
    if (camera.micro || state.lookOnly) return { kind: 'orbit', cursor: 'grab', sleeve: null, label: '' };

    if (state.recordMatrix && renderer.pickDisc(x, y, state.recordMatrix) !== null) {
      return state.recordHeld
        ? { kind: 'control', action: 'placeRecord', cursor: 'pointer', sleeve: null, label: 'Place on platter' }
        : { kind: 'control', action: 'recordMoving', cursor: 'default', sleeve: null, label: '' };
    }

    const index = pickSleeve(x, y);
    if (index !== null) {
      return { kind: 'fan', index, selection: state.selected, cursor: 'pointer', sleeve: index, label: '' };
    }

    const p = renderer.pick(x, y, 0);
    const deck = renderer.pick(x, y, -.019);
    const knob = renderer.pick(x, y, -.004);
    const arm = renderer.pick(x, y, .018);

    if (state.recordHeld && p && Math.hypot(...p) < .175) {
      return { kind: 'control', action: 'placeRecord', cursor: 'pointer', sleeve: null, label: 'Place record on platter' };
    }
    if (inBox(deck, -.144, -.19, -.092, -.151)) {
      return { kind: 'control', action: 'motor', cursor: 'pointer', sleeve: null, label: 'Start / Stop' };
    }
    if (inBox(deck, -.094, -.193, -.063, -.168)) {
      return { kind: 'control', action: 'speed33', cursor: 'pointer', sleeve: null, label: '33⅓ RPM' };
    }
    if (inBox(deck, -.063, -.193, -.032, -.168)) {
      return { kind: 'control', action: 'speed45', cursor: 'pointer', sleeve: null, label: '45 RPM' };
    }
    if (knob && Math.hypot(knob[0] - .17, knob[1] + .15) < .020) {
      return { kind: 'volume', value: state.volume, cursor: 'ew-resize', sleeve: null, label: 'Drag to adjust volume' };
    }
    if (inBox(deck, .231, -.17, .258, -.047)) {
      return { kind: 'pitch', cursor: 'ns-resize', sleeve: null, label: 'Drag pitch fader' };
    }
    if (inBox(deck, PIVOT_X + .032, PIVOT_Y - .065, PIVOT_X + .066, PIVOT_Y - .03)) {
      return { kind: 'control', action: 'cue', cursor: 'pointer', sleeve: null, label: 'Cue lever' };
    }
    if (deck && Math.hypot(deck[0] - PIVOT_X - .047, deck[1] - PIVOT_Y - .012) < .014) {
      return { kind: 'skate', value: state.skate, cursor: 'ew-resize', sleeve: null, label: 'Drag anti-skate dial' };
    }
    if (state.ready && !state.cutting && arm && renderer.armDistance(arm, state.al) < (pointerType === 'touch' ? .030 : .013)) {
      return { kind: 'arm', offset: state.al - angle(arm), cursor: 'grab', sleeve: null, label: 'Drag tonearm to cue' };
    }
    if (state.ready && !state.cutting && p && Math.hypot(...p) < R_DISC) {
      return { kind: 'platter', angle: Math.atan2(p[1], p[0]), point: p, cursor: 'grab', sleeve: null, label: '' };
    }
    return { kind: 'orbit', cursor: 'grab', sleeve: null, label: '' };
  }

  function free(cancel = true) {
    if (drag?.kind === 'arm') {
      command('hand', { on: false, cancel });
      if (cancel) command('cue', { up: true });
    }
    if (drag?.kind === 'platter') command('platter', { on: false });
    drag = null;
    canvas.style.cursor = 'grab';
  }

  canvas.addEventListener('pointerdown', e => {
    if (e.button > 2) return;
    pendingTap = null;
    camera.target = null;
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size >= 2) {
      free(true);
      const [a, b] = [...pointers.values()];
      drag = { kind: 'pinch', distance: Math.hypot(a[0] - b[0], a[1] - b[1]), center: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
      return;
    }

    const pan = e.button === 2 || e.shiftKey;
    const hit = pan ? { kind: 'pan' } : inspectTarget(e.clientX, e.clientY, e.pointerType);
    const state = getState();
    if (hit.kind === 'arm') command('hand', { on: true, al: state.al });
    if (hit.kind === 'platter') command('platter', { on: true });

    drag = { ...hit, id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, moved: 0 };
    canvas.style.cursor = hit.kind === 'control' ? 'pointer' : 'grabbing';
  });

  canvas.addEventListener('pointermove', e => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (!drag) {
      const hit = inspectTarget(e.clientX, e.clientY, e.pointerType);
      canvas.style.cursor = hit.cursor;
      hover({ sleeve: hit.sleeve, label: hit.label });
      return;
    }
    if (drag.kind === 'pinch') {
      const [a, b] = [...pointers.values()];
      if (!b) return;
      const distance = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const center = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      camera.distance *= drag.distance / Math.max(1, distance);
      pan(center[0] - drag.center[0], center[1] - drag.center[1]);
      drag.distance = distance;
      drag.center = center;
    } else {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0));
      if (drag.kind === 'orbit') { camera.az -= dx * .006; camera.el += dy * .006; camera.follow = false; }
      if (drag.kind === 'pan') pan(dx, dy);
      if (drag.kind === 'fan' && drag.moved > 12) {
        const next = Math.max(0, Math.min(fan.albums.length - 1, drag.selection - Math.round((e.clientX - drag.x0) / 56)));
        select(next, false);
      }
      if (drag.kind === 'arm') {
        const p = renderer.pick(e.clientX, e.clientY, .018);
        if (p) command('hand', { on: true, al: angle(p) + drag.offset });
      }
      if (drag.kind === 'platter') {
        const p = renderer.pick(e.clientX, e.clientY, 0);
        if (p) {
          const a = Math.atan2(p[1], p[0]);
          let d = a - drag.angle;
          if (d > Math.PI) d -= TAU;
          if (d < -Math.PI) d += TAU;
          command('platterMove', { d: -d });
          drag.angle = a;
        }
      }
      if (drag.kind === 'volume') {
        command('volume', { value: Math.round(Math.max(0, Math.min(100, drag.value + (e.clientX - drag.x0) / 1.5 - (e.clientY - drag.y0) / 1.5))) });
      }
      if (drag.kind === 'skate') {
        command('skate', { value: Math.max(0, Math.min(3, drag.value + (e.clientX - drag.x0) / 60 - (e.clientY - drag.y0) / 60)) });
      }
      if (drag.kind === 'pitch') {
        const p = renderer.pick(e.clientX, e.clientY, -.02);
        if (p) command('pitch', { value: Math.max(-8, Math.min(8, (p[1] + .11) / .06 * 8)) });
      }
      drag.x = e.clientX;
      drag.y = e.clientY;
    }
    limit();
    invalidate();
  });

  function pan(dx, dy) {
    if (camera.micro) return;
    const k = camera.distance * .0008;
    camera.focus[0] -= (Math.cos(camera.az) * dx + Math.sin(camera.az) * dy) * k;
    camera.focus[1] -= (Math.sin(camera.az) * dx - Math.cos(camera.az) * dy) * k;
    camera.follow = false;
  }

  function limit() {
    camera.el = Math.max(.14, Math.min(1.53, camera.el));
    camera.distance = Math.max(camera.micro ? .00018 : .10, Math.min(camera.micro ? .006 : 3, camera.distance));
    camera.focus[0] = Math.max(-.85, Math.min(.42, camera.focus[0]));
    camera.focus[1] = Math.max(-.25, Math.min(.25, camera.focus[1]));
  }

  canvas.addEventListener('pointerup', e => {
    pointers.delete(e.pointerId);
    if (!drag) return;
    if (drag.kind === 'pinch') { free(true); return; }
    if (drag.id !== e.pointerId) return;
    if (drag.moved < 8) {
      if (drag.kind === 'fan') { const index = drag.index; pendingTap = () => select(index, true); }
      if (drag.kind === 'control') { const action = drag.action; pendingTap = () => command(action); }
      if (drag.kind === 'platter' && Math.hypot(...drag.point) > R_LABEL) {
        const al = alphaForRadius(Math.hypot(...drag.point));
        pendingTap = () => command('cueTo', { al });
      }
    }
    free(false);
  });

  canvas.addEventListener('click', () => {
    const action = pendingTap;
    pendingTap = null;
    action?.();
  });

  canvas.addEventListener('pointercancel', () => { pointers.clear(); pendingTap = null; free(true); });
  canvas.addEventListener('lostpointercapture', e => {
    if (pointers.has(e.pointerId)) { pointers.delete(e.pointerId); pendingTap = null; free(true); }
  });
  canvas.addEventListener('pointerleave', () => {
    hover({ sleeve: null, label: '' });
    if (!drag) canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  canvas.addEventListener('wheel', e => {
    if (!e.ctrlKey && !e.metaKey && document.activeElement !== canvas) return;
    e.preventDefault();
    camera.target = null;
    camera.distance *= Math.exp(e.deltaY * .001);
    limit();
    invalidate();
  }, { passive: false });

  canvas.addEventListener('keydown', e => {
    if (e.key === '[' || e.key === 'PageUp') {
      e.preventDefault();
      select(Math.max(0, getState().selected - 1), false);
      return;
    }
    if (e.key === ']' || e.key === 'PageDown') {
      e.preventDefault();
      select(Math.min(fan.albums.length - 1, getState().selected + 1), false);
      return;
    }
    camera.target = null;
    if (e.key === 'ArrowLeft') camera.az += .12;
    else if (e.key === 'ArrowRight') camera.az -= .12;
    else if (e.key === 'ArrowUp') camera.el += .08;
    else if (e.key === 'ArrowDown') camera.el -= .08;
    else if (e.key === '+' || e.key === '=') camera.distance *= .9;
    else if (e.key === '-') camera.distance *= 1.1;
    else return;
    e.preventDefault();
    limit();
    invalidate();
  });

  return () => { pointers.clear(); pendingTap = null; free(true); };
}
