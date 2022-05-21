import { getUserId as getUserIdDB } from "../db.mjs";

// /userId/:userName
export function getUserId(req, res) {
    getUserIdDB(req.params.userName).then(({ rows }) => {
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
}