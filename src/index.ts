import { AudienceServer } from './AudienceServer';

let server = new AudienceServer();
server.startLobby();
let app = server.getApp();

export { app }