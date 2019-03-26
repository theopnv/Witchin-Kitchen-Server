import { Player } from '../Player/Player';
import { Viewer } from '../Viewer';

export class Game {
    id: number;
    pin: string;
    mainGameSocketID: string;
    madeGame: boolean;
    private players: Array<Player>;
    private viewers: Array<Viewer>; //socketIds

    constructor(socketId: string) {
        this.regenId();
        this.mainGameSocketID = socketId;
        this.players = [];
        this.viewers = [];
        this.madeGame = false;
    }

    regenId() {
        this.id = Math.floor(Math.random() * 999) + 1;
        this.pin = Game.idAsString(this.id);
    }

    static idAsString(id: number) {
        let num = id.toString();
        while (num.length < 3) {
            num = '0' + num;
        }
        return num;
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    addViewer(viewer: Viewer) {
        this.viewers.push(viewer);
        console.log("New viewer added to game " + this.pin + ": " + this.viewers);
    }

    removeViewer(viewerId: string) {
        const viewer = this.viewers.find(i => i.socketId === viewerId);
        const index = this.viewers.indexOf(viewer, 0);
        if (index > -1) {
            this.viewers.splice(index, 1);
        }
    }

    editViewer(viewer: Viewer) {
        const index = this.viewers.indexOf(viewer, 0);
        if (index > -1) {
            this.viewers[index] = viewer;
        }
    }

    update(update: Game) {
        this.players = update.players;
    }
}