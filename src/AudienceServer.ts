import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Message, User, Players, LobbyGames, Game } from './Models/';
import { GameCollection, PlayerCollection, EventCollection } from './Collections';
import { ExtendedSocket } from './ExtendedSocket';

//import { Message } from './model';

export class AudienceServer {
    public static readonly PORT: number = 8080;
    public static readonly SERVER_NAME: string = 'WITCHIN\' KITCHEN';
    private app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;
    private gameCollection: GameCollection;
    private playersInGame: PlayerCollection;
    private currentEvents: EventCollection;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.gameCollection = new GameCollection();
        this.playersInGame = new PlayerCollection();
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

    private gameQuit(socket: ExtendedSocket) {
        let game = this.gameCollection.getGameOfHost(socket.id);
        if (!game) {
            let message = new Message(new User(AudienceServer.SERVER_NAME), 'game does not exist');
            socket.emit('gameQuitError', message);
            return;
        }
        this.gameCollection.remove(game);
        this.playersInGame.remove(socket.id);
        let answer = new Message(new User(AudienceServer.SERVER_NAME), 'game has been stopped');
        socket.to(game.pin).emit('gameClosed', answer);
        console.log('Game ' + game.pin + 'quit message sent' + socket.id);
    }

    private makeGame(socket: ExtendedSocket) {
        socket.on('makeGame', () => {
            let gameOfHost = this.gameCollection.getGameOfHost(socket.id);
            if (gameOfHost) {
                console.log("User " + socket.id + " tried to make a game but has already one !");
                let message = new Message(new User(AudienceServer.SERVER_NAME), "You already created a game.");
                socket.emit('alreadyInGame', message);
                return;
            }
            let gameObject = new Game(socket.id);
            while (this.gameCollection.gameNameExists(gameObject.id))
                gameObject.regenId();
            this.gameCollection.add(gameObject);
            socket.join(gameObject.pin);
            console.log("Game Created by " + socket.id + " w/ " + gameObject.pin);
            socket.emit('gameCreated', gameObject);
        });
    }


    public pollind(socket: ExtendedSocket) {
        socket.on('createPoll', () => {

        })
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

            socket.on('registerPlayers', (players: Players) => {
                console.log('[server](New Players registered): %s', socket.id);
                this.playersInGame.add(socket.id, players);
                let message = new Message(new User(AudienceServer.SERVER_NAME),
                    'successfully registered as players');
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

            socket.on('quitGame', () => {
                console.log('Game quit by ' + socket.id);
                this.gameQuit(socket);
            });

            this.makeGame(socket);
            socket.on('disconnect', () => {
                this.gameQuit(socket);
            });
        });
    }
}