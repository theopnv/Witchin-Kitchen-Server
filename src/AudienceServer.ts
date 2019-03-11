import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { Message, Players, Game, PollChoices, GameOutcome, Player, Viewer, Spell } from './Models/';
import { GameCollection, PlayerCollection, PollCollection } from './Collections';
import { ExtendedSocket } from './ExtendedSocket';
import { Codes } from './Codes';

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
    private currentPolls: PollCollection;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
        this.gameCollection = new GameCollection();
        this.playersInGame = new PlayerCollection();
        this.currentPolls = new PollCollection();
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

    private gameQuit(socket: ExtendedSocket, gameOutcome: GameOutcome) {
        let game = this.gameCollection.getGameOfHost(socket.id);
        if (!game) {
            let message = new Message(
                Codes.QUIT_GAME_ERROR, 
                'Error while exiting the game: The game does not exist');
            socket.emit('message', message);
            return;
        }
        this.gameCollection.remove(game);
        this.playersInGame.remove(socket.id);
        let answer = new Message(
            Codes.QUIT_GAME_SUCCESS,
            'Game successfully exited');
        socket.emit('message', answer);
        socket.to(game.pin).emit('gameQuit', gameOutcome);
        console.log('Game ' + game.pin + ' quit message sent ' + socket.id);
    }

    private audienceQuit(socket: ExtendedSocket) {
        let game = this.gameCollection.getGameById(socket.gameId);
        if (!game) {
            let message = new Message(
                Codes.AUDIENCE_QUIT_GAME_ERROR,
                'Error while exiting the game: The game does not exist');
            socket.emit('message', message);
            return;
        }
        game.removeViewer(socket.id);
        socket.to(game.pin).emit('gameUpdate', game);
        console.log('Game ' + game.pin + ': viewer ' + socket.id + ' quit game');
    }

    private makeGame(socket: ExtendedSocket) {
        socket.on('makeGame', () => {
            let gameOfHost = this.gameCollection.getGameOfHost(socket.id);
            if (gameOfHost) {
                console.log("User " + socket.id + " tried to make a game but has already one !");
                let message = new Message(
                    Codes.MAKE_GAME_ERROR, 
                    "Error, the player already created a room.");
                socket.emit('message', message);
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

    private updateGameState(socket: ExtendedSocket) {
        socket.on('updateGameState', (gameUpdated: Game) => {
            let game = this.gameCollection.getGameOfHost(socket.id);
            let message = new Message(
                Codes.UPDATE_GAME_ERROR,
                "Error, could not send stats to the viewer");
            if (!game) {
                console.log("User " + socket.id + " game is not found !");
                socket.emit('message', message);
                return;
            }
            game.update(gameUpdated);
            this.gameCollection.add(game);
            socket.to(game.pin).emit('updateGameState', game);
            message.code = Codes.UPDATE_GAME_SUCCESS;
            message.content = "Successfully sent an update to the viewer";
            socket.emit('message', message);
        })
    }

    private pollTimeOut(socket: ExtendedSocket, duration: number, gameId: number) {
        let that = this;
        let cb = function () {
            let endPoll: PollChoices = that.currentPolls.getPollByGameId(gameId);
            socket.emit('event', endPoll);
            socket.to(Game.idAsString(gameId)).emit('pollResults', endPoll);
            that.currentPolls.removeEvent(gameId);
        };
        setTimeout(cb, duration * 1000);
    }

    public polling(socket: ExtendedSocket) {
        socket.on('launchPoll', (choices: PollChoices) => {
            let game = this.gameCollection.getGameOfHost(socket.id);
            let errorMsg = new Message(
                Codes.LAUNCH_POLL_ERROR,
                "Error, could not broadcast poll");
            if (!game) {
                console.log("User " + socket.id + " tried to launch a poll but game is not found !");
                socket.emit('message', errorMsg);
                return;
            }
            if (!choices.duration) {
                console.log("Player " + socket.id + " did not set deadline in " + game.id);
                errorMsg.content = "Error, duration not set.";
                socket.emit('message', errorMsg);
                return;
            }
            let deadline = new Date();
            deadline.setSeconds(deadline.getSeconds() + +choices.duration);
            let poll = new PollChoices(deadline.toISOString(), choices.duration, choices.events);
            this.currentPolls.addEvent(game.id, poll);
            socket.to(game.pin).emit('eventList', choices);
            let message = new Message(
                Codes.LAUNCH_POLL_SUCCESS,
                "Poll successfully broadcasted");
            socket.emit('message', message);
            this.pollTimeOut(socket, +poll.duration, game.id);
        });
        socket.on('vote', (eventId: number) => {
            let errorMsg = new Message(
                Codes.VOTE_ERROR,
                "Error, game info not valid.");
            if (!socket.gameId) {
                console.log("Audience " + socket.id + " game id not valid, can't vote");
                socket.emit('message', errorMsg);
                return;
            }
            let game = this.gameCollection.getGameById(socket.gameId);
            if (!game) {
                console.log("Audience " + socket.id + " game not found with gameId " + socket.gameId);
                socket.emit('message', errorMsg);
                return;
            }
            let poll = this.currentPolls.getPollByGameId(game.id);
            if (!poll) {
                console.log("Audience " + socket.id + " poll not found with gameId " + game.id);
                socket.emit('message', errorMsg);
                return;
            }
            let deadline = new Date(poll.deadline);
            if (new Date() >= deadline) {
                console.log("Audience " + socket.id + " vote passed deadline in " + game.id);
                errorMsg.content = "Error, vote did not go through. Deadline passed ?";
                errorMsg.code = Codes.VOTE_DEADLINE_PASSED;
                socket.emit('message', errorMsg);
                return;
            }
            poll.vote(eventId);
            let message = new Message(
                Codes.VOTE_SUCCESS,
                "Vote successfully taken into account.");
            socket.emit('message', message);
            console.log(game.pin)
            this.io.in(game.pin).emit('pollResults', poll);
        })
    }

    public spellCasting(socket: ExtendedSocket) {
        socket.on('launchSpellCast', (viewer: Viewer) => {
            console.log("launchSpellCast: " + viewer.socketId)
            // TODO: Probably good to check that sockets[viewer.socketId] actually exists
            this.io.to(`${viewer.socketId}`).emit('castSpell');
            let answer = new Message(
                Codes.LAUNCH_SPELL_CAST_SUCCESS,
                'Successfully asked the viewer to cast a spell'
            );
            socket.emit('message', answer);
        });

        socket.on('castSpell', (spell: Spell) => {
            console.log('cast spell request from a viewer: spellId = ' + spell.spellId)
            let game = this.gameCollection.getGameById(socket.gameId);
            socket.to(game.pin).emit('spell', spell);
            let answer = new Message(
                Codes.SPELL_CASTED_SUCCESS,
                'Spell successfully casted'
            );
            socket.emit('message', answer);
        });
    }

    public startLobby() {
        this.io.on('connect', (socket: ExtendedSocket) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('registerPlayers', (players: Players) => {
                console.log('[server](New Players registered): %s', socket.id);
                this.playersInGame.add(socket.id, players);
                let game = this.gameCollection.getGameOfHost(socket.id);
                if (!game) {
                    let message = new Message(
                        Codes.REGISTER_PLAYERS_ERROR,
                        'Host does not have a game yet');
                    socket.emit('message', message);
                    return;
                }
                for (let player of players.players)
                    game.addPlayer(player);
                    game.madeGame = true;
                    socket.to(game.pin).emit('updateGameState', game);
                let message = new Message(
                    Codes.REGISTER_PLAYERS_SUCCESS,
                    'Players registered successfully');
                socket.emit('message', message);
            });

            socket.on('joinGame', (id: number) => {
                let game = this.gameCollection.getGameById(id);
                if (!game) {
                    let message = new Message(
                        Codes.JOIN_GAME_ERROR, 
                        'Error, could not join the room. The room ' + id + ' does not exist.');
                    socket.emit('message', message);
                    return;
                }
                socket.join(Game.idAsString(game.id));
                socket.gameId = game.id;
                let viewer = new Viewer();
                viewer.socketId = socket.id;
                game.addViewer(viewer);
                console.log(socket.id + " joined " + game.id);

                socket.to(game.pin).emit('gameUpdate', game);
                socket.emit('joinedGame', viewer);

                if (game.madeGame) {
                    socket.emit('updateGameState', game);
                }
                this.gameCollection.add(game);
            });

            socket.on('registerViewer', (viewer: Viewer) => {
                let game = this.gameCollection.getGameById(socket.gameId);
                game.editViewer(viewer);
                let answer = new Message(
                    Codes.REGISTER_VIEWER_SUCCESS,
                    'Viewer registered successfully'
                );
                socket.emit('message', answer);
            });

            socket.on('quitGame', (gameOutcome: GameOutcome) => {
                console.log('Game quit by ' + socket.id);
                this.gameQuit(socket, gameOutcome);
            });

            this.makeGame(socket);
            this.polling(socket);
            this.spellCasting(socket);
            this.updateGameState(socket);
            socket.on('disconnect', () => {
                if (socket.gameId)
                    this.audienceQuit(socket);
                else {
                    let gameOutcome = new GameOutcome(false, null);
                    this.gameQuit(socket, gameOutcome);
                }
            });
        });
    }
}