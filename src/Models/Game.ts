import { Player } from './Player';
import { Viewer } from './Viewer';

export class Game {
    id: number;
    pin: string;
    mainGameSocketID: string;
    private players: Array<Player>;
    private viewers: Array<Viewer>; //socketIds

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

    addViewer(viewer: Viewer) {
        this.viewers.push(viewer);
        console.log(this.viewers);
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
}