import { Game } from '../Models/Game';

export class GameCollection {
    private readonly gameDict: Map<string, Game>;
    private readonly gameNames: Map<number, string>;
    private readonly gameNotStarted: Set<number>;

    constructor() {
        this.gameDict = new Map<string, Game>();
        this.gameNames = new Map<number, string>();
        this.gameNotStarted = new Set<number>();
    }

    getGameDict() : Map<string, Game> {
        return this.gameDict;
    }

    add(game: Game) {
        this.gameDict.set(game.host, game);
        this.gameNames.set(game.id, game.host);
        this.gameNotStarted.add(game.id);
    }

    remove(game: Game) {
        this.gameDict.delete(game.host);
        this.gameNames.delete(game.id);
        this.gameNotStarted.delete(game.id);
    }

    gameStarted(id: number) {
        return this.gameNotStarted.delete(id);
    }

    getGameOfHost(host: string) : Game {
        return this.gameDict.get(host);
    }

    gameNameExists(id: number) : Boolean {
        return this.gameNames.has(id);
    }

    getGameById(id: number) : Game {
        let game: Game = null;
        if (this.gameNotStarted.has(id)) {
            let host = this.gameNames.get(id);
            game = this.gameDict.get(host);
        }
        return game;
    }

    getGameListNames() : Array<number> {
        if (this.gameNames.size == 0)
            return null;
        return Array.from(this.gameNames.keys());
    }
}