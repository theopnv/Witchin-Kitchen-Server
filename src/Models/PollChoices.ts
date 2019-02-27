import { Event } from './Event';

export class PollChoices {
    events: Event[];
    deadline: string;
    duration: number;

    constructor(date: string = "", duration: number, eventArr: Event[] = Array<Event>()) {
        this.events = eventArr;
        this.deadline = date;
        this.duration = duration;
    }

    vote(eventId: number) {
        let idx = this.events.findIndex(event => event.id == eventId);
        if (idx == -1)
            return false;
        this.events[idx].votes += 1;
        return true;
    }
}