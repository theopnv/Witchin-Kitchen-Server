import { Viewer } from './Viewer';
import { Player } from './Player';

export class SpellRequest {
    targetedViewer: Viewer;
    fromPlayer: Player;
}