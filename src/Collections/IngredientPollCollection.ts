import { IngredientPoll, PollChoices } from '../Models';

export class IngredientPollCollection {
    private polls: Map<number, IngredientPoll>;
    constructor() {
        this.polls = new Map();
    }

    addEvent(gameId: number, event: IngredientPoll) {
        return this.polls.set(gameId, event);
    }

    removeEvent(gameId: number) {
        return this.polls.delete(gameId);
    }

    getPollByGameId(gameId: number) : IngredientPoll {
        return this.polls.get(gameId);
    }
}