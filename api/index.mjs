import express from "express";
import cors from "cors";
import http from "http";
import https from "https";
import fs from "fs";

import { getChannelId } from './getChannelId.mjs';
import { getMessagesInChannel } from './getMessagesInChannel.mjs';
import { getMessagesInChannelForUser } from './getMessagesInChannelforUser.mjs';
import { getUserChannels } from './getUserChannels.mjs';
import { getUserId } from './getUserId.mjs';
import { getUserName } from './getUserName.mjs';

const app = express();
app.use(cors());

export function setupAPI(config) {
    app.get("/channelId/:channelName", getChannelId);

    app.get("/userId/:userName", getUserId);

    app.get("/userName/:userId", getUserName);

    app.get("/channel/:channel", getMessagesInChannel);

    app.get("/channel/:channel/user/:user", getMessagesInChannelForUser);

    app.get("/userChannels/:user", getUserChannels);

    if (config.http) {
        const httpServer = http.createServer(app);
        httpServer.listen(config.http.port);
    }

    if (config.https) {
        const key = fs.readFileSync(`../${config.https.key}`, "utf-8");
        const crt = fs.readFileSync(`../${config.https.cert}`, "utf-8");
        const credentials = { key: key, cert: crt };
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(config.https.port);
    }
}