import { User } from './user';

export class Message {
    constructor(public from: User, public code: number, public content: string) {
    }
}