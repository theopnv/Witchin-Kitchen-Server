import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Message } from './Models/Message';
import { User } from './Models/User';
import { GameCollection } from './GameCollection';
import { Game } from './Game';
import { ExtendedSocket } from './ExtendedSocket';
import { GameCreationInfo } from './Models/GameCreationInfo';
import { LobbyGames } from './Models/LobbyGames';

//import { Message } from './model';

export class AudienceServer {
    public static readonly PORT: number = 8080;
    public static readonly SERVER_NAME: string = 'WITCHIN\' KITCHEN';
    private app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private lobby: socketIo.Namespace;
    private port: string | number;
    private gameCollection: GameCollection;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.gameCollection = new GameCollection();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || AudienceServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
    }

    public getApp(): express.Application {
        return this.app;
    }

    private makeGame(socket: ExtendedSocket) {
        socket.on('makeGame', () => {
            if (!socket.username) {
                let message = new Message(new User(AudienceServer.SERVER_NAME), "Please register your username before.");
                socket.emit('gameCreationError', message);
                return;
            }
            let gameOfHost = this.gameCollection.getGameOfHost(socket.username);
            if (gameOfHost) {
                console.log("User " + socket.username + " tried to make a game but has already one !");
                let message = new Message(new User(AudienceServer.SERVER_NAME), "You already created a game.");
                socket.emit('gameCreationError', message);
                return;
            }
            let gameObject = new Game(socket.username);
            while (this.gameCollection.gameNameExists(gameObject.id))
                gameObject.regenId();
            this.gameCollection.add(gameObject);
            socket.join(gameObject.id.toString());
            console.log("Game Created by " + socket.username + " w/ " + gameObject.id);
            socket.emit('gameCreated', gameObject);
        });
    }


    public startLobby() {
        this.io.on('connect', (socket: ExtendedSocket) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('registerAsHost', (user: User) => {
                console.log('[server](New Host registered): %s', user.name);
                socket.username = user.name;
                let message = new Message(new User(AudienceServer.SERVER_NAME), 'successfully registered as host');
                this.io.emit('message', message);
            });

            socket.on('registerAsAudience', (user: User) => {
                console.log('[server](New Audience registered): %s', user.name);
                socket.username = user.name;
                let message = new Message(new User(AudienceServer.SERVER_NAME), 'successfully registered as audience');
                socket.emit('message', message);
            });

            socket.on('refreshLobby', () => {
                let gameNameArray = this.gameCollection.getGameListNames();
                socket.emit('lobby', new LobbyGames(gameNameArray))
            });

            socket.on('joinGame', (id: number) => {
                let game = this.gameCollection.getGameById(id);
                if (!game) {
                    let message = new Message(new User(AudienceServer.SERVER_NAME), 'game does not exist');
                    socket.emit('gameJoinError', message);
                    return;
                }
                socket.join(game.id.toString());
                console.log(socket.username + " joined " + game.id);
                let answer = new Message(new User(AudienceServer.SERVER_NAME), 'game joined successfully');
                socket.emit('gameJoined', answer);
            });

            this.makeGame(socket);
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}