import { connect } from "./bot.mjs";
import { initDB, saveMessage } from './db.mjs';
import { setupAPI } from './api/index.mjs';

await initDB();
setupAPI();

connect((channel, user, msg) => {
    saveMessage(msg, user["room-id"], channel, user["user-id"], user["username"]);
});