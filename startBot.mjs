import { connect } from "./bot.mjs";
import { initDB, saveMessage } from "./db.mjs";

await initDB();

connect((channel, user, msg) => {
    saveMessage(msg, user["room-id"], channel, user["user-id"], user["username"]);
});
