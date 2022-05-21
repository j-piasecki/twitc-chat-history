import { getMessagesInChannel as getMessagesInChannelDB } from "../db.mjs";
import {
    figureOutChannel,
    clamp,
    DEFAULT_REQUESTED_MESSAGES,
    MIN_REQUESTED_MESSAGES,
    MAX_REQUESTED_MESSAGES,
    MAX_INT
} from "./common.mjs";

// /channel/:channel
export function getMessagesInChannel(req, res) {
    const response = { messages: [], end: false };
    const amount = clamp(req.query.amount || DEFAULT_REQUESTED_MESSAGES, MIN_REQUESTED_MESSAGES, MAX_REQUESTED_MESSAGES);
    const lastMessage = Number.parseInt(req.query.last) || MAX_INT;
    const channel = figureOutChannel(req.params.channel);

    if (Number.isNaN(lastMessage)) {
        res.status(400).end();
        return;
    }

    getMessagesInChannelDB(channel, amount + 1, lastMessage).then(({ rows }) => {
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
}