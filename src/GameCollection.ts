import { Game } from './Game';
import { GameCreationInfo } from './Models/GameCreationInfo';

export class GameCollection {
    private totalgameCount: number;
    private readonly gameDict: Map<string, Game>;
    private readonly gameNames: Map<string, string>;

    constructor() {
        this.totalgameCount = 0;
        this.gameDict = new Map<string, Game>();
        this.gameNames = new Map<string, string>();
    }

    getGameDict() : Map<string, Game> {
        return this.gameDict;
    }

    add(game: Game) {
        this.gameDict.set(game.host, game);
        this.gameNames.set(game.gameName, game.host);
    }

    getGameOfHost(host: string) : Game {
        return this.gameDict.get(host);
    }

    gameNameExists(name: string) : Boolean {
        return this.gameNames.has(name);
    }

    getGameByName(name: string) : Game {
        let game: Game = null;
        if (this.gameNames.has(name)) {
            let host = this.gameNames.get(name);
            game = this.gameDict.get(host);
        }
        return game;
    }

    getGameListNames() : Array<string> {
        if (this.gameNames.size == 0)
            return null;
        return Array.from(this.gameNames.keys());
    }
}