import { Player } from './Player';

export class Game {
    id: number;
    pin: string;
    mainGameSocketID: string;
    private players: Array<Player>;
    private viewers: Array<string>; //socketIds

    constructor(socketId: string) {
        this.regenId();
        this.mainGameSocketID = socketId;
        this.players = [];
        this.viewers = [];
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

    addPlayer(player: Player) {
        this.players.push(player);
    }

    addViewer(viewerId: string) {
        this.viewers.push(viewerId);
    }

    removeViewer(viewerId: string) {
        this.viewers = this.viewers.filter(v => v == viewerId);
    }
}