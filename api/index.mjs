import express from "express";
import cors from "cors";
import http from "http";
import https from "https";

import { getChannelId } from './getChannelId.mjs';
import { getMessagesInChannel } from './getMessagesInChannel.mjs';
import { getMessagesInChannelForUser } from './getMessagesInChannelforUser.mjs';
import { getUserChannels } from './getUserChannels.mjs';
import { getUserId } from './getUserId.mjs';
import { getUserName } from './getUserName.mjs';

//const key = fs.readFileSync("certs/kew.key", "utf-8");
//const crt = fs.readFileSync("certs/crt.crt", "utf-8");
//const credentials = { key: key, cert: crt };

const app = express();
app.use(cors());

export function setupAPI() {
    app.get("/channelId/:channelName", getChannelId);

    app.get("/userId/:userName", getUserId);

    app.get("/userName/:userId", getUserName);

    app.get("/channel/:channel", getMessagesInChannel);

    app.get("/channel/:channel/user/:user", getMessagesInChannelForUser);

    app.get("/userChannels/:user", getUserChannels);

    let httpServer = http.createServer(app);
    //let httpsServer = https.createServer(credentials, app);
    httpServer.listen(8080);
    //httpsServer.listen(443);
}