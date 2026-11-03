// One way out to the speakers, shared by her voice and the room. The score knows when she is about to
// speak, so the bed makes room on her breath instead of reacting to her first consonant. Nothing here
// is read by the scene, and nobody has heard the result: every number below is a choice made on paper.

import { outputChain } from "./voice.js";

// Shallow and slow on the way back: room tone covers her spliced pauses, so a deep or quick duck would pump.
const DUCK = 10 ** (-4 / 20), DOWN = 0.09, UP = 0.3;

/**
 * @param {BaseAudioContext} context
 * @returns {{context:BaseAudioContext,voice:GainNode,bed:GainNode,sfx:GainNode,setMuted:(muted:boolean)=>void,follow:(speaking:boolean)=>void}}
 * `bed` ducks under speech (room, music); `sfx` and `voice` do not. All sum into one limiter.
 */
export function createOutput(context) {
  const chain = outputChain(context), master = context.createGain(), duck = context.createGain();
  const voice = context.createGain(), bed = context.createGain(), sfx = context.createGain();
  voice.connect(master); sfx.connect(master); bed.connect(duck); duck.connect(master); master.connect(chain.input);
  chain.output.connect(context.destination);
  let ducked = false;
  return {
    context, voice, bed, sfx,
    /** A short ramp, so a mute under a word is not a click. */
    setMuted(muted) { master.gain.setTargetAtTime(muted ? 0 : 1, context.currentTime, 0.015); },
    follow(speaking) {
      if (speaking === ducked) return;
      ducked = speaking;
      duck.gain.setTargetAtTime(speaking ? DUCK : 1, context.currentTime, speaking ? DOWN : UP);
    },
  };
}
