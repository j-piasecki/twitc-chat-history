import { getMessagesInChannelForUser as getMessagesInChannelForUserDB } from "../db.mjs";
import {
    figureOutChannel,
    figureOutUser,
    clamp,
    DEFAULT_REQUESTED_MESSAGES,
    MIN_REQUESTED_MESSAGES,
    MAX_REQUESTED_MESSAGES,
    MAX_INT
} from "./common.mjs";

// /channel/:channel/user/:user
export function getMessagesInChannelForUser(req, res) {
    const response = { messages: [], end: false };
    const amount = clamp(req.query.amount || DEFAULT_REQUESTED_MESSAGES, MIN_REQUESTED_MESSAGES, MAX_REQUESTED_MESSAGES);
    const lastMessage = req.query.last || MAX_INT;
    const channel = figureOutChannel(req.params.channel);
    const user = figureOutUser(req.params.user);

    getMessagesInChannelForUserDB(channel, user, amount + 1, lastMessage).then(({ rows }) => {
        const messages = rows.length - 1 === amount ? amount : rows.length;
        for (let i = 0; i < messages; i++) {
            response.messages.push(rows[i]);
        }

        if (rows.length < amount + 1) {
            response.end = true;
        }

        res.status(200).send(JSON.stringify(response)).end();
    }).catch(() => {
        res.status(404).end();
    });
}