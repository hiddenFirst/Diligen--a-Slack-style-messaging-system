import pg from 'pg';
import jwt from 'jsonwebtoken';

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

const SECRET_KEY = process.env.SECRET;

/**
 *
 *
 * @param {string} email email
 * @param {string} password password
 * @returns {object} return object
 */
export async function loginInfor(email, password) {
  let query;
  let values = [];

  if (email === '' || password === '') {
    return undefined;
  }

  if (!email || !password) {
    return undefined;
  } else {
    query = `
        SELECT json_Build_object
          ('id', id,
          'email', data->>'email',
          'name', data->'name',
          'lastLocation', data->'lastLocation'
          )
        FROM person
        WHERE data->>'email' = $1
        AND data->>'pwhash' = crypt($2, data->>'pwhash')
      `;
    values = [email, password];
  }

  const {rows} = await pool.query(query, values);

  if (rows.length === 0 || !rows) {
    return undefined;
  }

  const user = rows[0].json_build_object;

  const token = jwt.sign({id: user.id,
    email: user.email, name: user.name,
    lastLocation: user.lastLocation}, SECRET_KEY, {expiresIn: '1h'});


  return {id: user.id, email: user.email, name: user.name,
    token: token, lastLocation: user.lastLocation};
}

/**
 *
 * @param {string} userId userId
 * @returns {Array} Array
 */
export async function workspacesInfor(userId) {
  const query = `
    SELECT w.id, w.data->>'name' AS name
    FROM workspaces w
    JOIN person_workspaces pw ON w.id = pw.workspace_id
    WHERE pw.person_id = $1
  `;
  const {rows} = await pool.query(query, [userId]);

  if (rows.length === 0 || !rows) {
    return [];
  }
  return rows;
}

/**
 *
 * @param {string} userId userId
 * @param {string} workspaceId workspaceId
 * @returns {Array} Array
 */
export async function channelsInfor(userId, workspaceId) {
  const query = `
    SELECT c.id, c.data->>'name' AS name
    FROM channels c
    JOIN person_workspaces pw ON c.workspace_id = pw.workspace_id
    WHERE pw.person_id = $1 AND c.workspace_id = $2
  `;
  const {rows} = await pool.query(query, [userId, workspaceId]);

  return rows;
}

/**
 *
 * @param {string} channelId channelId
 * @returns {object} object
 */
export async function messagesInfor(channelId) {
  const query = `
    SELECT id, data
    FROM messages
    WHERE channel_id = $1
    ORDER BY (data->>'timestamp')::timestamptz ASC;
  `;

  const {rows} = await pool.query(query, [channelId]);

  console.log(rows);
  return rows.map((row) => ({id: row.id, ...row.data}));
}

/**
 *
 * @param {string} userId userId
 * @param {string} channelId channelId
 * @returns {boolean} boolean
 */
export async function userHasAccessToChannel(userId, channelId) {
  const query = `
    SELECT 1 FROM person_workspaces pw
    JOIN channels c ON pw.workspace_id = c.workspace_id
    WHERE pw.person_id = $1 AND c.id = $2
  `;
  const {rowCount} = await pool.query(query, [userId, channelId]);

  return rowCount > 0;
}

/**
 *
 * @param {string} channelId channelId
 * @param {object} messageData messageData
 * @returns {string} string
 */
export async function postMessagesInfor(channelId, messageData) {
  const query = `
    INSERT INTO messages (channel_id, data)
    VALUES ($1, $2::jsonb)
    RETURNING id;
  `;

  const {rows} = await pool.query(query, [
    channelId, JSON.stringify(messageData),
  ]);

  return rows[0].id;
}

/**
 * @param {string} userId userId
 * @param {object} location location
 * @returns {object} object
 */
export async function updateLastLocation(userId, location) {
  const {workspaceId, channelId, messageId} = location;

  const query = `
    UPDATE person
    SET data = jsonb_set(
      data,
      '{lastLocation}',
      jsonb_build_object(
        'workspaceId', to_jsonb($2::text),
        'channelId', to_jsonb($3::text),
        'messageId', to_jsonb($4::text)
      ),
      true
    )
    WHERE id = $1
    RETURNING json_build_object(
      'workspaceId', (data->'lastLocation'->>'workspaceId'),
      'channelId', (data->'lastLocation'->>'channelId'),
      'messageId', (data->'lastLocation'->>'messageId')
    ) AS lastLoc;
  `;

  const {rows} = await pool
      .query(query, [userId, workspaceId, channelId, messageId]);

  return rows[0].lastloc; // { workspaceId, channelId, messageId }
}

/**
 * @param {string} userId  person table uuid
 * @returns {object|null} { workspaceId, channelId, messageId } or null
 */
export async function getLastLocation(userId) {
  const query = `
    SELECT data->'lastLocation' AS lastLoc
    FROM person
    WHERE id = $1
  `;
  const {rows} = await pool.query(query, [userId]);

  return rows[0].lastloc;
}

