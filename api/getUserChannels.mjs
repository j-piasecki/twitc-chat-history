import { getUserChannels as getUserChannelsDB } from "../db.mjs";
import { figureOutUser } from "./common.mjs";

// /userChannels/:user
export function getUserChannels(req, res) {
    const user = figureOutUser(req.params.user);

    getUserChannelsDB(user).then(({ rows }) => {
        if (rows.length > 0) {
            res.status(200).send(JSON.stringify({
                channels: rows
            })).end();
        } else {
            res.status(404).end();
        }
    }).catch(() => {
        res.status(404).end();
    });
}