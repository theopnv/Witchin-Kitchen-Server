export class Game {
    id: string;
    host: string;
    gameName: string;
    private players: Array<string>;

    constructor(hostName: string, gameName: string) {
        this.id = (Math.random()+1).toString(36).slice(2, 18);
        this.host = hostName;
        this.gameName = gameName;
        this.players = new Array<string>();
    }

    addPlayer(player: string) {
        this.players.push(player);
    }
}