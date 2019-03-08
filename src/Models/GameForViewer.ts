import { Viewer } from './Viewer';
import { Game } from './Game';

export class GameForViewer {
    game: Game;
    viewer: Viewer; //socketIds

    constructor(viewer: Viewer, game: Game) {
        this.game = game;
        this.viewer = viewer;
    }
}