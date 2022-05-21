import { getChannelId as getChannelIdDB } from "../db.mjs";
import { figureOutChannel } from "./common.mjs";

// /channelId/:channelName
export function getChannelId(req, res) {
    const channelName = figureOutChannel(req.params.channelName);

    getChannelIdDB(channelName).then(({ rows }) => {
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
}