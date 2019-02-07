import { Game } from './Game';
import { GameCreationInfo } from './Models/GameCreationInfo';

export class GameCollection {
    private totalgameCount: number;
    private readonly gameDict: Map<string, Game>;
    private readonly gameNames: Set<string>;

    constructor() {
        this.totalgameCount = 0;
        this.gameDict = new Map<string, Game>();
    }

    getGameDict() : Map<string, Game> {
        return this.gameDict;
    }

    add(game: Game) {
        this.gameDict.set(game.host, game);
        this.gameNames.add(game.gameName);
    }

    getGameOfHost(host: string) : Game {
        return this.gameDict.get(host);
    }

    gameNameExists(name: string) {
        return this.gameNames.has(name);
    }
}