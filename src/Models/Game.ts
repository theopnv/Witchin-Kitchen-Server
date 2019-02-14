export class Game {
    id: number;
    pin: string;
    host: string;
    private players: Array<string>;

    constructor(hostName: string) {
        this.regenId();
        this.host = hostName;
        this.players = new Array<string>();
    }

    regenId() {
        this.id = Math.floor(Math.random() * 9999) + 1;
        this.pin = this.idAsString();
    }

    idAsString() {
        let num = this.id.toString();
        while (num.length < 4) {
            num = '0' + num;
        }
        return num;
    }

    addPlayer(player: string) {
        this.players.push(player);
    }
}