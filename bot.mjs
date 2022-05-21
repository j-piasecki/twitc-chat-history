import tmi from "tmi.js";
import fs from "fs";
import fetch from "node-fetch";

const listenOn = JSON.parse(fs.readFileSync("channels.json", "utf-8"));
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

const defaultToken = "";

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
        console.log(`* Connected to ${addr}:${port}`);

        setInterval(() => {
            console.log(`Status: ${client.readyState()}, listening on: ${client.getChannels().join(", ")}, ${messages} m/s`);
            messages = 0;
        }, 1000);
    });

    client.connect().catch(async() => {
        console.log("Connection failed, refreshing token...")
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${config.refreshToken}&client_id=${config.clientId}&client_secret=${config.clientSecret}`
        })
        const data = await response.json();

        config.refreshToken = data.refresh_token;
        fs.writeFileSync("config.json", JSON.stringify(config));
        console.log("Token refreshed:", data.access_token);

        connect(messageCallback, data.access_token);
    });
}