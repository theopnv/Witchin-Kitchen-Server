import { Player } from './Player';

export class GameOutcome {
    get leaderboard(): Player[] {
        return this._leaderboard;
    }

    set leaderboard(value: Player[]) {
        this._leaderboard = value;
    }
    private _leaderboard: Player[];

    constructor() {
        this._leaderboard = new Array<Player>();
    }


    addPlayer(player: Player) {
        this._leaderboard.push(player)
    }
}