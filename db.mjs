import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chat_logs',
    password: 'zaq1@WSX',
    port: 5432,
})

export async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS channel_names(
            id INTEGER PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_names(
            id INTEGER PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS messages(
            id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
            message VARCHAR(500) NOT NULL,
            timestamp BIGINT NOT NULL,
            channel_id INTEGER NOT NULL,
            channel_name VARCHAR(50) NOT NULL,
            user_id INTEGER NOT NULL,
            user_name VARCHAR(50) NOT NULL,

            CONSTRAINT fk_channel
                FOREIGN KEY(channel_id) REFERENCES channel_names(id)
                ON DELETE CASCADE,

            CONSTRAINT fk_user
                FOREIGN KEY(user_id) REFERENCES user_names(id)
                ON DELETE CASCADE
        );
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS channel_timestamp_index ON messages(
            channel_id,
            timestamp DESC
        );
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS channel_user_timestamp_index ON messages(
            channel_id,
            user_id,
            timestamp DESC
        );
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS user_timestamp_index ON messages(
            user_id,
            timestamp DESC
        );
    `);


    await pool.query(`
        CREATE INDEX IF NOT EXISTS channel_names_index ON channel_names USING hash(
            name
        );
    `);

    await pool.query(`
        CREATE INDEX IF NOT EXISTS user_names_index ON user_names USING hash(
            name
        );
    `);
}

export async function saveMessage(message, channelId, channelName, userId, userName) {
    await Promise.all([
        pool.query(`INSERT INTO channel_names (id, name) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name`, [channelId, channelName]),
        pool.query(`INSERT INTO user_names (id, name) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name`, [userId, userName]),
    ]);

    pool.query(`
        INSERT INTO messages (message, timestamp, channel_id, channel_name, user_id, user_name)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [message, Date.now(), channelId, channelName, userId, userName]);
}

export async function getChannelId(channelName) {
    return await pool.query(`SELECT id, name FROM channel_names WHERE name=$1`, [channelName]);
}

export async function getUserId(userName) {
    return await pool.query(`SELECT id, name FROM user_names WHERE name=$1`, [userName]);
}

export async function getMessagesInChannel(channel, amount, lastMessage) {
    if (typeof channel === 'number') {
        return await pool.query(`SELECT * from messages WHERE channel_id=$1 AND id<$2 ORDER BY timestamp DESC LIMIT $3`, [channel, lastMessage, amount])
    }

    return await pool.query(`
        SELECT * from messages WHERE channel_id=(
            SELECT id FROM channel_names WHERE name=$1
        ) AND id<$2 ORDER BY timestamp DESC LIMIT $3
    `, [channel, lastMessage, amount])
}