import tmi from "tmi.js";
import fs from "fs";

const listenOn = JSON.parse(fs.readFileSync("channels.json", "utf-8"));

function makeConfig(token, channels) {
    return {
        connection: {
            reconnect: true,
        },
        channels: channels,
    };
}

let messages = 0;

export function connect(messageCallback, token) {
    const client = new tmi.client(makeConfig(token === undefined ? defaultToken : token, listenOn.channels));

    client.on("message", (channel, user, msg, self) => {
        messageCallback(channel, user, msg);
        messages++;
    });

    client.on("connected", (addr, port) => {
        console.log(`Connected to ${addr}:${port}`);

        setInterval(() => {
            console.log(`Status: ${client.readyState()}, listening on: ${client.getChannels().join(", ")}, ${messages / 5} m/s`);
            messages = 0;
        }, 5000);
    });

    client.connect().catch((e) => {
        console.log("Couldn't connect to Twitch", e);
    });
}