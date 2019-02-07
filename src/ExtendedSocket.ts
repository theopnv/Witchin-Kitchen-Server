import { Socket } from 'socket.io';

export interface ExtendedSocket extends Socket {
    username: string;
}