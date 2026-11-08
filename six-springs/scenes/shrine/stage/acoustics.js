/**
 * Every physical consequence is a sound before it is a meaning.
 *
 * The figure works because drivers can only write pose numbers. The shrine's
 * residents get the same narrowing: they do not list each other's event names.
 * A source declares how loud it is at one metre; a listener compares one number,
 * how loud the world is where it stands, with its own nerve. A new resident that
 * knocks, drops or scatters is therefore heard by the bird, the beetle and
 * whatever comes later without editing any of them.
 *
 * Levels are decibels at 1 m and fall 6 dB per doubling of distance (free-field
 * inverse square, never louder than the source itself). They are authored
 * stage values in a physical shape, not measurements. The sound pass can read
 * the same table, so what an animal startles at is what a visitor hears.
 */

/** dB at 1 m. A function receives the event when loudness depends on what happened. */
export const SOURCES = Object.freeze({
  bell: 100,            // bronze, struck at the wall
  land: 85,             // the offering bowl meeting stone
  stamp: 80,            // a hard set-down
  'saint-land': 62,     // her bare-footed hop landing
  'board-knock': 70,
  'board-seat': 64,
  'board-scrape': 52,
  'board-chime': e => 50 + 14 * Math.min(1, (e.speed ?? 0) / 1.5),
  'wall-symbol-seat': 60,
  'wall-symbol-stop': 56,
  'bird-depart': 58,    // the clap of wings leaving a roof
  'bird-land': 38,
  'bird-hop': 34,
  'frog-land': 46,
  'insect-takeoff': 28,
  'sack-compress': 50,
  'sack-untie': 42,
  'sack-tie': 42,
  'sack-grain-land': 30,
  'sack-rice-spilled': 36,
  'rice-grain-land': e => 22 + 14 * Math.min(1, (e.speed ?? 0) / 3),
  'rice-knock': 40,
  'rice-heap-land': 24,
  'rice-bowl-land': 26,
  'rice-stomp': 66,        // her bare foot, hard, on stone
});

/** Source level in dB at 1 m, or null when the event makes no sound. */
export function level(event) {
  const source = SOURCES[event?.kind];
  if (source === undefined) return null;
  const value = typeof source === 'function' ? source(event) : source;
  return Number.isFinite(value) ? value : null;
}

/** Decibels heard at a world point. Unknown position counts as at the listener. */
export function heard(event, at) {
  const value = level(event);
  if (value === null) return -Infinity;
  const point = event.point ?? event.position;
  if (!point || !at) return value;
  const distance = Math.hypot(...point.map((v, i) => v - at[i]));
  return value - 20 * Math.log10(Math.max(1, distance));
}

/**
 * A listener's nerve: how far above its threshold a sound is, in startle units
 * (0 below the threshold, 1 per `span` dB above it). Habituation is the
 * resident's business; this is only the ear.
 */
export function startle(event, at, threshold, span = 30) {
  return Math.max(0, (heard(event, at) - threshold) / span);
}
