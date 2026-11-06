// The one experience: a single page someone arrives at from a homepage. She is alive before you do
// anything. Your first click anywhere opens the audio and counts as whatever you clicked on. Every
// decision about when she speaks lives in the Director; this file only connects the room to a browser.

import * as THREE from "three";
import { createStage } from "../scenes/shrine/stage/renderer.js";
import { stagePerformance } from "../scenes/shrine/stage/performance.js";
import { Clock } from "../src/scene.js";
import { withFace } from "../src/speech/face-rig.js";
import { createLetteringStage } from "../src/speech/lettering-stage.js";
import { WallMap } from "../src/speech/compose.js";
import { Voice } from "../src/speech/voice.js";
import { createOutput } from "../src/speech/output.js";
import { LINES, parseLines } from "../scenes/shrine/speech/direction.js";
import { Director } from "../scenes/shrine/speech/director.js";
import { Speaker, defaultTake } from "../scenes/shrine/speech/speaker.js";
import { captionText } from "./captions.js";
import { framePainting } from './framing.js';

const $ = id => document.getElementById(id);
const root = new URL("../", import.meta.url), at = path => new URL(path, root);
const get = async (path, as = "json") => { const r = await fetch(at(path)); if (!r.ok) throw new Error(`${r.status}: ${path}`); return r[as](); };
const remembered = key => { try { return localStorage.getItem(key); } catch { return null; } };
const remember = (key, value) => { try { localStorage.setItem(key, value); } catch { /* A private window just forgets. */ } };
const WIDTH = 1536, HEIGHT = 1024, TOUCH = matchMedia("(hover: none)").matches, CALM = matchMedia("(prefers-reduced-motion: reduce)");
// Below this the words get too small to read, so the picture crops instead of shrinking. A crop always keeps
// everything from the bowl she asks for to the bell, even if the smallest phones must shrink a little for it.
// Height comes off the roof first, down to the top of the bell's rope.
const SMALLEST = 0.52, KEEP_WIDTH = 720, KEEP_MIDDLE = [640, 560], ROOF = 190, BELOW_THE_PICTURE = 156, SHORTEST_ROOM = 300;

let director, performance, speaker, stage, letters, voice, clock;
let audio = null, sound = null, entered = false, muted = remembered("dalang.muted") === "1", pointer = null, previous = null, paused = false, limit = null, shown = null, saidUntil = null, lost = false;
let captionScore = null, captionAge = 0, fullCaption = remembered("dalang.fullText") === "1";
let baseFraming=null,framingKey=null;

/**
 * Fit the painting: all of it when there is room, otherwise a crop from the bowl to the bell. On an upright
 * phone the picture gives up its roof so that her words and a row of controls have room underneath.
 */
function layout() {
  const w = innerWidth, h = innerHeight, scale = Math.max(Math.min(w / WIDTH, h / HEIGHT), Math.min(SMALLEST, w / KEEP_WIDTH));
  const cw = WIDTH * scale, ch = HEIGHT * scale, narrow = cw > w + 1, stacked = narrow && h > w;
  const place = (size, room, middle, total) => size <= room ? (room - size) / 2 : Math.max(room - size, Math.min(0, room / 2 - middle / total * size));
  const roomHeight = stacked ? Math.min(ch, Math.max(h - BELOW_THE_PICTURE, SHORTEST_ROOM)) : Math.min(h, ch);
  const x = place(cw, w, KEEP_MIDDLE[0], WIDTH), y = stacked ? -Math.min(ch - roomHeight, ROOF * scale) : ch > h ? place(ch, h, KEEP_MIDDLE[1], HEIGHT) : 0;
  const room = $("room"), canvas = $("stage");
  document.body.classList.toggle("stacked", stacked);
  room.style.height = `${roomHeight}px`;
  room.style.top = narrow ? "0" : `${Math.max(0, (h - roomHeight) / 2)}px`;
  Object.assign(canvas.style, { width: `${cw}px`, height: `${ch}px`, left: `${x}px`, top: `${y}px` });
  baseFraming={width:w,height:roomHeight,scale,x,y};framingKey=null;
  document.body.classList.toggle("narrow", narrow);
  $("said").style.top = `${roomHeight}px`;
  if (!performance) return;
  // Writing composes inside what can be seen. A recorded input, since it changes where words go.
  const next = narrow ? [Math.round(-x / scale) + 14, Math.round((w - x) / scale) - 14] : null;
  if (JSON.stringify(next) !== JSON.stringify(limit)) { limit = next; performance.send({ kind: "speech-settings", settings: { limit } }); }
  presentFraming();
}

function presentFraming(){
  if(!baseFraming)return;
  const frame=performance?.things.framing(),view=framePainting(baseFraming,frame,CALM.matches);
  const key=[view.scale,view.x,view.y,view.active].join(',');
  if(key===framingKey)return;
  framingKey=key;
  Object.assign($('stage').style,{width:`${WIDTH*view.scale}px`,height:`${HEIGHT*view.scale}px`,left:`${view.x}px`,top:`${view.y}px`});
  $('return-view').hidden=!view.active;
  // Lettering keeps the recorded normal crop. Temporary panning is a pure
  // render sample; captions below the picture remain available throughout.
}

function dismissView(){
  const frame=performance.things.framing();
  if(!frame||$('return-view').hidden)return false;
  performance.send(frame.dismiss);
  if(document.activeElement===$('return-view'))document.querySelector(`#things [data-do="${CSS.escape(frame.returnControl)}"]`)?.focus();
  return true;
}

/** The first gesture. A browser allows sound only from here on, so this is where the room starts to be heard. */
async function startAudio() {
  const context = new AudioContext({ latencyHint: "interactive" });
  audio = createOutput(context);
  audio.setMuted(muted);
  voice.attach(context, audio.voice);
  context.resume();
  // Decode every line now, so nothing has to catch up while she is mid-sentence.
  for (const [line, takes] of Object.entries(speaker.assets.takes)) voice.load(takes[director.settings.takes[line]].audio).catch(() => { voice.failed = true; });
  try {
    const { createSound } = await import("../src/audio/index.js");
    const room = createSound({ context, bed: audio.bed, sfx: audio.sfx, voice: audio.voice, performance, baseURL: at("scenes/shrine/sound/") });
    sound = room;
    room.whenReady?.().catch(error => roomSilent(room, error));
  } catch (error) { roomSilent(null, error); }
}

/** The room's sound failed. Nothing else depends on it: she still speaks and everything still works. */
function roomSilent(room, error) {
  console.warn("Room sound unavailable", error);
  if (sound === room) sound = null;
  try { room?.dispose?.(); } catch { /* It never finished starting. */ }
  note("The sound of the room did not load. Her voice still works.");
}

function note(text) { $("note").hidden = false; $("note").textContent = text; }

function gesture() {
  if (audio && audio.context.state !== "running") audio.context.resume();
  if (entered) return;
  entered = true;
  startAudio();
  performance.send({ kind: "enter" });
  $("prompt").classList.add("gone");
}

function setMuted(value) {
  muted = value;
  remember("dalang.muted", muted ? "1" : "0");
  $("mute").setAttribute("aria-pressed", muted);
  $("mute-label").textContent = muted ? "Sound off" : "Sound on";
  $("mute").setAttribute("aria-label", muted ? "Sound is off. Turn it on." : "Sound is on. Turn it off.");
  audio?.setMuted(muted);
}

/** A thing in the room, by name: the same whether it came from a click on the painting or from a keyboard. */
function act(thing, x, y) {
  const options = {experience:true, ...(x === undefined ? {} : {point:[x,y]})};
  if (!performance.interact(thing ?? "wall", options)) performance.send({kind:"poke",target:thing ?? "wall",x:x??0,y:y??0});
}

const ray = new THREE.Raycaster();
function wordAt(x,y){
  ray.setFromCamera(new THREE.Vector2(x / WIDTH * 2 - 1, 1 - y / HEIGHT * 2), stage.camera);
  return letters.pick(ray);
}
function clickAt(x, y) {
  gesture();
  const word = wordAt(x,y);
  if (word) { performance.send({ kind: "knock-word", word }); return; }
  act(thingAt(x, y), x, y);
}

/** A forgiving finger. Small things win near misses, because the frog is worth more than the sack it hides behind. */
function thingAt(x, y) {
  const direct = stage.pick(x, y);
  const resident = performance.things.pick(x,y,direct);
  if (resident) return resident;
  if (direct || !document.body.classList.contains("narrow")) return direct;
  for (const [dx, dy] of [[0, -26], [26, 0], [0, 26], [-26, 0], [18, -18], [18, 18], [-18, 18], [-18, -18]]) {
    const near = stage.pick(x + dx, y + dy);
    if (near) return near;
  }
  return null;
}

function painting(event) {
  const box = $("stage").getBoundingClientRect();
  return [Math.round((event.clientX - box.left) * WIDTH / box.width), Math.round((event.clientY - box.top) * HEIGHT / box.height)];
}

function wire() {
  const canvas = $("stage");
  let capture=null,suppressClick=false;
  canvas.onpointermove = event => {
    const [x,y]=painting(event);pointer={kind:'pointer',x,y,touch:event.pointerType==='touch'};
    if(capture?.id===event.pointerId)performance.things.gesture(capture.target,'move',[x,y]);
  };
  canvas.onpointerdown = event => {
    const [x,y]=painting(event);pointer={kind:'pointer',x,y,touch:event.pointerType==='touch'};
    if(capture||event.button!==0)return;
    suppressClick=false;
    if(wordAt(x,y))return;
    const target=thingAt(x,y);
    if(performance.things.gesture(target,'start',[x,y])){
      gesture();capture={target,id:event.pointerId};suppressClick=true;canvas.setPointerCapture(event.pointerId);
    }
  };
  function finishPointer(event,phase){
    if(capture?.id!==event.pointerId)return;
    performance.things.gesture(capture.target,phase,painting(event));capture=null;
    if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
  }
  canvas.onpointerup=event=>finishPointer(event,'end');
  canvas.onpointercancel=event=>finishPointer(event,'cancel');
  canvas.onlostpointercapture=event=>finishPointer(event,'cancel');
  canvas.onpointerleave = event => { if (event.pointerType !== "touch") pointer = { kind: "pointer", active: false }; };
  canvas.onclick = event => {if(suppressClick){suppressClick=false;return;}clickAt(...painting(event));};
  for (const button of document.querySelectorAll("#things button")) {
    button.onclick = () => { gesture(); act(performance.things.control(button.dataset.do)); };
    button.onkeydown = event => {
      if(performance.things.key(performance.things.control(button.dataset.do),event.key)){gesture();event.preventDefault();}
    };
  }
  $("mute").onclick = () => { gesture(); setMuted(!muted); sound?.ui?.("tap"); };
  $("caption-mode").onclick = () => {
    fullCaption = !fullCaption;
    remember("dalang.fullText", fullCaption ? "1" : "0");
    renderCaption();
  };
  $('return-view').onclick=dismissView;
  addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if(event.key==='Escape'&&dismissView()){event.preventDefault();return;}
    if (event.key === "m" || event.key === "M") { gesture(); setMuted(!muted); }
    if (event.key === "`") { $("inspect").hidden = !$("inspect").hidden; }
  });
  addEventListener("resize", layout);
  // Nothing plays to an empty room. The scene clock stops by itself when frames stop; the audio has to be told.
  document.addEventListener("visibilitychange", () => {
    previous = null;
    if (!audio || lost) return;
    if (document.hidden) audio.context.suspend(); else audio.context.resume();
  });
  // The browser can take the graphics away, on a phone especially. A blank room should not go on talking.
  canvas.addEventListener("webglcontextlost", event => {
    event.preventDefault(); // Without this it can never come back.
    lost = true;
    audio?.context.suspend();
    $("lost").hidden = false;
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = false; previous = null;
    $("lost").hidden = true;
    stage.renderer.shadowMap.needsUpdate = true;
    if (!document.hidden) audio?.context.resume();
    draw();
  });
  $("reload").onclick = () => location.reload();
  CALM.addEventListener?.("change", () => performance.send({ kind: "speech-settings", settings: { calm: CALM.matches } }));
}

function renderCaption() {
  if (!captionScore) return;
  const text = captionText(captionScore, captionAge, fullCaption);
  if ($("caption-visual").textContent !== text) $("caption-visual").textContent = text;
  $("caption-mode").hidden = captionScore.register !== "sutra";
  $("caption-mode").textContent = fullCaption ? "Follow recital" : "Read full line";
  $("caption-mode").setAttribute("aria-pressed", String(fullCaption));
}

/** Full accessible text remains available; the visible recital reveals one phrase at a time. */
function caption(tick) {
  const current = speaker.current, key = current?.id ?? null;
  if (current && key !== shown) {
    captionScore = current.score;
    $("said-accessible").textContent = current.score.text;
    $("said").style.opacity = 1; $("said").scrollTop = 0;
    saidUntil = current.startTick + current.score.ticks + 72;
  }
  if (current) { captionAge = tick - current.startTick; renderCaption(); }
  else if (shown !== null && captionScore?.register === "sutra") saidUntil = tick + 72;
  shown = key;
  // Frames can skip ticks, so this is a deadline and not a moment. The words stay for a screen reader; only the sight of them goes.
  if (!current && saidUntil !== null && tick >= saidUntil) {
    $("said").style.opacity = 0; $("caption-mode").hidden = true; saidUntil = null;
  }
}

function status() {
  const c = speaker.current, recent = voice.drift.slice(-120).map(Math.abs);
  return [`tick ${performance.scene.tick}`, c ? `line ${c.line}, ${c.audio ?? "unvoiced"}, ${c.score.ticks} ticks` : "silent",
    `voice error, recent worst ${recent.length ? Math.round(Math.max(...recent) * 1000) : "-"} ms, resyncs ${voice.resyncs}`,
    `audio ${audio?.context.state ?? "not started"}, room sound ${sound ? "on" : "none"}`, `word cards ${letters.cardCount}`,
    `pending ${JSON.stringify(director.pending)}`, `restless ${Math.round(director.restless)}, hover ${director.hovered}, touch ${director.touch}`,
    `said ${[...director.saidAt.keys()].join(" ") || "-"}`, `limit ${JSON.stringify(limit)}`, `fps target 24, canvas ${WIDTH}x${HEIGHT}`].join("\n");
}

function step() { if (pointer) { performance.send(pointer); pointer = null; } performance.step(); }
function draw() { letters.sync(speaker.lettering); letters.poseTongue(speaker.lettering, performance.frame("frog.mouth").position); stage.render(); presentFraming(); }

function loop(now) {
  requestAnimationFrame(loop);
  if (previous === null) previous = now;
  const delta = Math.max(0, (now - previous) / 1000); previous = now;
  if (paused || lost) return;
  if (clock.advance(delta, step)) {
    draw();
    caption(performance.scene.tick);
    if (!$("inspect").hidden) $("status").textContent = status();
  }
  const position = performance.scene.tick + clock.accumulator * 24;
  voice.follow(speaker.current, position);
  const c = speaker.current, speaking = !!c && position >= c.startTick + c.score.onset - 8;
  audio?.follow(speaking);
  sound?.frame({ tick: performance.scene.tick, position, speaking, hidden: document.hidden });
  if (voice.failed && !$("note").dataset.shown) { $("note").dataset.shown = 1; note("Her voice did not load. Her words still appear on the wall."); }
}

async function build() {
  const [bakedRaw, faceArt, wallMap, config, manifest, voiceData, linesMd, picks] = await Promise.all([
    get("characters/six-springs/baked.json"), get("scenes/shrine/speech/face.json"), get("scenes/shrine/speech/wall-map.json"),
    get("scenes/shrine/stage/calibration.json"), get("scenes/shrine/stage/assets/manifest.json"), get("scenes/shrine/speech/takes/aki.json"),
    get("scenes/shrine/speech/lines.md", "text"), get("scenes/shrine/speech/picks.json"),
  ]);
  await Promise.all(["DalangInk", "DalangInkMedium", "DalangInkLight", "DalangWater"].map(f => document.fonts.load(`32px ${f}`)));

  performance = stagePerformance(withFace(bakedRaw, faceArt), config, {
    beforePose: (tick, phase) => director.before(tick, phase),
    afterPhysics: (tick, phase) => { director.after(tick, phase); const batch = [...phase.events, ...director.drain()]; sound?.events(batch); },
  });
  // The inspection plates stay out of what a visitor downloads.
  stage = await createStage($("stage"), config, { ...manifest, master: null, originalStudy: null }, performance, at("scenes/shrine/stage/assets/"));
  letters = createLetteringStage(stage.scene, stage.projection, document.createElement("canvas").getContext("2d"), new WallMap(wallMap));
  speaker = new Speaker(performance.actor, { written: parseLines(linesMd), takes: voiceData.lines }, letters, () => stage.projection.project(performance.root));
  director = new Director(performance, speaker, { bell: () => letters.wallAt({ x: 930, y: 430 }), frogMouth: () => letters.floorAt(performance.frame("frog.mouth").position) });
  voice = new Voice(at("scenes/shrine/speech/takes/"));
  clock = new Clock();

  // Jonas's kept picks win. Otherwise each line uses its coolest unflagged take.
  const takes = Object.fromEntries(Object.keys(LINES).map(k => [k, picks[k] ?? defaultTake(voiceData.lines[k])]));
  performance.send({ kind: "speech-settings", settings: { voiced: true, written: true, takes, calm: CALM.matches } });
  layout();
  performance.send({ kind: "title", text: "Six Springs Three Rivers" });
  letters.warm(() => stage.render());
}

try {
  await build();
  wire();
  setMuted(muted);
  for (let i = 0; i < 2; i++) step();
  draw();
  document.documentElement.dataset.ready = "1";
  document.body.classList.add("ready");
  layout();
  const prompt = $("prompt");
  prompt.textContent = TOUCH ? "With sound. Tap anything." : "With sound. Click anything.";
  prompt.hidden = false;
  $("veil").classList.add("gone");
  setTimeout(() => $("veil").remove(), 1000);
  const params = new URLSearchParams(location.search);
  if (params.has("inspect")) $("inspect").hidden = false;
  if (params.get("autoplay") !== "0") requestAnimationFrame(loop);
  // Exact stepping for tests and for us. A visitor never meets this.
  window.dalang = {
    performance, speaker, director, stage, letters, voice, get audio() { return audio; }, get sound() { return sound; }, click: clickAt, gesture,
    step(n = 1) { for (let i = 0; i < n; i++) { step(); caption(performance.scene.tick); } draw(); }, pause() { paused = true; previous = null; }, play() { paused = false; previous = null; },
    pointer(x, y, touch = false) { pointer = { kind: "pointer", x, y, touch }; }, status,
  };
} catch (error) {
  console.error(error);
  const webgl = /webgl|context/i.test(String(error.message));
  window.dalangFail(webgl ? "This browser could not start WebGL, which draws the room. It may be turned off in its settings, or unavailable on this device." : "Part of the shrine did not load. It may be the connection.", !webgl);
}
