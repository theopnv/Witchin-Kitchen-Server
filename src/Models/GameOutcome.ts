import { Player } from './Player';

export class GameOutcome {
    get leaderboards(): Player[] {
        return this._leaderboards;
    }

    set leaderboards(value: Player[]) {
        this._leaderboards = value;
    }
    private _leaderboards: Player[];

    constructor() {
        this._leaderboards = new Array<Player>();
    }


    addPlayer(player: Player) {
        this._leaderboards.push(player)
    }
}