import { Player } from './Player';

export class GameOutcome {
    constructor(winner: Player) {
        this.winner = winner;
    }

    winner: Player;
}