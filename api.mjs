import express from "express";
import cors from "cors";
import http from "http";
import https from "https";

import {
    getChannelId,
    getUserId,
    getMessagesInChannel,
    getMessagesInChannelForUser,
} from "./db.mjs";

const MAX_INT = 2147483647;
const MIN_REQUESTED_MESSAGES = 10;
const MAX_REQUESTED_MESSAGES = 100;
const DEFAULT_REQUESTED_MESSAGES = 25;

//const key = fs.readFileSync("certs/kew.key", "utf-8");
//const crt = fs.readFileSync("certs/crt.crt", "utf-8");
//const credentials = { key: key, cert: crt };

const app = express();
app.use(cors());

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

// check if input is number, if so assume it's the channel id otherwise assume
// it's channel name (must start with `#` so add it in case it's not there)
function figureOutChannel(queryInput) {
    const channelId = Number.parseInt(queryInput);
    if (Number.isNaN(channelId)) {
        return queryInput.startsWith("#") ? queryInput : `#${queryInput}`;
    } else {
        return channelId;
    }
}

// same as above, but without `#`
function figureOutUser(queryInput) {
    const userId = Number.parseInt(queryInput);
    if (Number.isNaN(userId)) {
        return queryInput
    } else {
        return userId;
    }
}

export function setupAPI() {
    app.get("/channelId/:channelName", (req, res) => {
        const channelName = req.params.channelName.startsWith("#") ? req.params.channelName : `#${req.params.channelName}`;

        getChannelId(channelName).then(({ rows }) => {
            if (rows.length > 0) {
                res.status(200).send(JSON.stringify({
                    id: rows[0].id,
                    name: rows[0].name.substring(1),
                })).end();
            } else {
                res.status(404).end();
            }
        }).catch(() => {
            res.status(404).end();
        });
    });

    app.get("/userId/:userName", (req, res) => {
        getUserId(req.params.userName).then(({ rows }) => {
            if (rows.length > 0) {
                res.status(200).send(JSON.stringify({
                    id: rows[0].id,
                    name: rows[0].name,
                })).end();
            } else {
                res.status(404).end();
            }
        }).catch(() => {
            res.status(404).end();
        });
    });

    app.get("/channel/:channel", (req, res) => {
        const response = { messages: [], end: false };
        const amount = clamp(req.query.amount || DEFAULT_REQUESTED_MESSAGES, MIN_REQUESTED_MESSAGES, MAX_REQUESTED_MESSAGES);
        const lastMessage = Number.parseInt(req.query.last) || MAX_INT;
        const channel = figureOutChannel(req.params.channel);

        if (Number.isNaN(lastMessage)) {
            res.status(400).end();
            return;
        }

        getMessagesInChannel(channel, amount + 1, lastMessage).then(({ rows }) => {
            for (let i = 0; i < rows.length - 1; i++) {
                response.messages.push(rows[i]);
            }

            if (rows.length < amount + 1) {
                response.end = true;
            }

            res.status(200).send(JSON.stringify(response)).end();
        }).catch(() => {
            res.status(404).end();
        });
    });

    app.get("/channel/:channel/user/:user", (req, res) => {
        const response = { messages: [], end: false };
        const amount = clamp(req.query.amount || DEFAULT_REQUESTED_MESSAGES, MIN_REQUESTED_MESSAGES, MAX_REQUESTED_MESSAGES);
        const lastMessage = req.query.last || MAX_INT;
        const channel = figureOutChannel(req.params.channel);
        const user = figureOutUser(req.params.user);

        getMessagesInChannelForUser(channel, user, amount + 1, lastMessage).then(({ rows }) => {
            for (let i = 0; i < rows.length - 1; i++) {
                response.messages.push(rows[i]);
            }

            if (rows.length < amount + 1) {
                response.end = true;
            }

            res.status(200).send(JSON.stringify(response)).end();
        }).catch(() => {
            res.status(404).end();
        });
    });

    let httpServer = http.createServer(app);
    //let httpsServer = https.createServer(credentials, app);
    httpServer.listen(8080);
    //httpsServer.listen(443);
}