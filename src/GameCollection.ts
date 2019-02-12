import { Game } from './Game';

export class GameCollection {
    private readonly gameDict: Map<string, Game>;
    private readonly gameNames: Map<string, string>;
    private readonly gameNotStarted: Set<string>;

    constructor() {
        this.gameDict = new Map<string, Game>();
        this.gameNames = new Map<string, string>();
        this.gameNotStarted = new Set<string>();
    }

    getGameDict() : Map<string, Game> {
        return this.gameDict;
    }

    add(game: Game) {
        this.gameDict.set(game.host, game);
        this.gameNames.set(game.gameName, game.host);
        this.gameNotStarted.add(game.gameName);
    }

    gameStarted(name: string) {
        this.gameNotStarted.delete(name);
    }

    getGameOfHost(host: string) : Game {
        return this.gameDict.get(host);
    }

    gameNameExists(name: string) : Boolean {
        return this.gameNames.has(name);
    }

    getGameByName(name: string) : Game {
        let game: Game = null;
        if (this.gameNotStarted.has(name)) {
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