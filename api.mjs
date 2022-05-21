import express from "express";
import cors from "cors";
import http from "http";
import https from "https";

import {
    getChannelId,
    getUserId,
    getMessagesInChannel,
} from "./db.mjs";

const MAX_INT = 2147483647;

//const key = fs.readFileSync("certs/kew.key", "utf-8");
//const crt = fs.readFileSync("certs/crt.crt", "utf-8");
//const credentials = { key: key, cert: crt };

const app = express();
app.use(cors());

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
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
        const amount = clamp(req.query.amount || 25, 10, 100);
        const lastMessage = Number.parseInt(req.query.last) || MAX_INT;

        let channel = req.params.channel;

        const channelId = Number.parseInt(channel);
        if (Number.isNaN(channelId)) {
            channel = channel.startsWith("#") ? channel : `#${channel}`;
        } else {
            channel = channelId;
        }

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

    let httpServer = http.createServer(app);
    //let httpsServer = https.createServer(credentials, app);
    httpServer.listen(8080);
    //httpsServer.listen(443);
}