import { Event } from './Event';

export class PollChoices {
    private events: Event[];
    deadline: string;

    vote(eventId: number) {
        let idx = this.events.findIndex(event => event.id == eventId);
        if (idx == -1)
            return false;
        this.events[idx].votes += 1;
        return true;
    }
}