import { sack } from './sack.js';
import { gestures } from './gestures.js';
import { frog } from './frog.js';
import { waterfall } from './waterfall.js';
import { clayBowl } from './clay-bowl.js';
import { board } from './board.js';
import { wallSymbol } from './wall-symbol.js';
import { insect } from './insect.js';
import { bird } from './bird.js';
import { rice } from './rice.js';

// Composition only. Add an import and factory here; behavior stays in its file.
export const shrineThings = [gestures, frog, waterfall, wallSymbol, board, clayBowl, bird, insect, sack, rice];
