import { Players } from './Players';

export class PlayerCollection {
    private playersMap: Map<string, Players>;

    constructor() {
        this.playersMap = new Map();
    }

    add(socketId: string, players: Players) {
        this.playersMap.set(socketId, players);
    }

    remove(socketId: string, players: Players) {
        this.playersMap.delete(socketId);
    }
}