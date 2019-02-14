export class Game {
    id: number;
    host: string;
    private players: Array<string>;

    constructor(hostName: string) {
        this.regenId();
        this.host = hostName;
        this.players = new Array<string>();
    }

    regenId() {
        this.id = Math.floor(Math.random() * 9999) + 1;
    }

    addPlayer(player: string) {
        this.players.push(player);
    }
}