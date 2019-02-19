import { Player } from './Player';

export class GameOutcome {
    constructor(gameFinished: boolean, winner: Player) {
        this.gameFinished = gameFinished;
        this.winner = winner;
    }

    gameFinished: boolean;
    winner: Player;
}