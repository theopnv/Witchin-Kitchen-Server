import { PollChoices } from '../Models';

export class PollCollection {
    private polls: Map<number, PollChoices>;
    constructor() {
        this.polls = new Map();
    }

    addEvent(gameId: number, event: PollChoices) {
        return this.polls.set(gameId, event);
    }

    removeEvent(gameId: number) {
        return this.polls.delete(gameId);
    }

    getPollByGameId(gameId: number) {
        return this.polls.get(gameId);
    }
}