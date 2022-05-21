import { getUserName as getUserNameDB } from "../db.mjs";

// /userName/:userId
export function getUserName(req, res) {
    getUserNameDB(req.params.userId).then(({ rows }) => {
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