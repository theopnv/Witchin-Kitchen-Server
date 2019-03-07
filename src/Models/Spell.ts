import { Player } from './Player';
import { Viewer } from './Viewer';

export class Spell {
    spellId: number;
    targetedPlayer: Player;
    caster: Viewer;
}