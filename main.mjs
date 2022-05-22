import fs from 'fs';

import { connect } from "./bot.mjs";
import { initDB, saveMessage } from './db.mjs';
import { setupAPI } from './api/index.mjs';

const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

await initDB();
setupAPI(config);

connect((channel, user, msg) => {
    saveMessage(msg, user["room-id"], channel, user["user-id"], user["username"]);
});