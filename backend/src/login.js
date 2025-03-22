import * as db from './db.js';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET;

/**
 *
 * @param {object} req request
 * @param {object} res response
 * @returns {object} return object
 */
export async function getPersonInfor(req, res) {
  const loginInfor = await db.loginInfor(req.query.email, req.query.password);
  if (loginInfor) {
    return res.status(200).send(loginInfor);
  } else {
    const token = req.headers['authorization']?.split(' ')[1];
    try {
      const user = jwt.verify(token, SECRET_KEY);
      const lastLoc = await db.getLastLocation(user.id);
      return res.status(200)
          .json({userId: user.id, email: user.email,
            name: user.name, lastLocation: lastLoc});
    } catch {
      return res.status(404).json({error: 'Invalid token email or password'});
    }
  }
}

/**
 *
 * @param {object} req request
 * @param {object} res response
 * @returns {object} return object
 */
export async function getworkspaces(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(404).json({error: 'Unauthorized'});
  }

  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;

  const workspaces = await db.workspacesInfor(userId);

  if (!workspaces || workspaces.length === 0) {
    return res.status(404).json({error: 'No workspaces found'});
  }

  return res.status(200).json(workspaces);
}

/**
 *
 * @param {object} req request
 * @param {object} res response
 * @returns {object} return object
 */
export async function getchannels(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(404).json({error: 'Unauthorized'});
  }

  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;
  const {workspaces} = req.query;

  if (!workspaces) {
    return res.status(404).json({error: 'Missing workspace_id'});
  }

  const channels = await db.channelsInfor(userId, workspaces);

  if (!channels || channels.length === 0) {
    return res.status(404).json({error: 'No channels found'});
  }

  return res.status(200).json(channels);
}

/**
 *
 * @param {object} req request
 * @param {object} res response
 * @returns {object} return object
 */
export async function getmessages(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({error: 'Unauthorized'});

  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.id;

  const {channelId} = req.query;
  if (!channelId || channelId === '') {
    return res.status(404)
        .json({error: 'channel_id is required'});
  }

  // **Check if the user has permission to access this channel**
  const hasAccess = await db.userHasAccessToChannel(userId, channelId);
  if (!hasAccess) {
    return res.status(403)
        .json({error: 'Forbidden: You don\'t have access to this channel'});
  }

  // **quary messages**
  const messages = await db.messagesInfor(channelId);
  if (!messages || messages.length === 0) {
    return res.status(404).json({error: 'No messages found'});
  }

  res.status(200).json(messages);
}

/**
 *
 * @param {object} req request
 * @param {object} res response
 * @returns {object} return object
 */
export async function postmessages(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({error: 'Unauthorized'});

  const decoded = jwt.verify(token, SECRET_KEY);
  const userEmail = decoded.email;

  console.log('Request Body:', req.body);

  const {channelId, text} = req.body;
  if (!channelId || !text) {
    return res.status(400).json({error: 'channel_id and text are required'});
  }

  const hasAccess = await db.userHasAccessToChannel(decoded.id, channelId);
  if (!hasAccess) {
    return res.status(403)
        .json({error: 'Forbidden: You don\'t have access to this channel'});
  }

  const messageData = {
    text: text,
    sender: decoded.name,
    timestamp: new Date().toISOString(),
    UserEmail: userEmail,
    thread: [],
  };

  const messageId = await db.postMessagesInfor(channelId, messageData);

  res.status(200)
      .json({message: 'Message created successfully', id: messageId});
}

/**
 * PATCH /api/v0/lastlocation
 * { workspaceId, channelId, messageId }
 * @param {object} req request
 * @param {object} res response
 * @returns {object} return object
 */
export async function updateLastLocation(req, res) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({error: 'Unauthorized'});

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch {
    return res.status(403).json({error: 'Invalid token'});
  }

  const userId = decoded.id;
  const {workspaceId, channelId, messageId} = req.body;

  // 调用 db.js 里的函数
  const lastLoc = await db
      .updateLastLocation(userId, {workspaceId, channelId, messageId});

  return res.status(200).json({lastLocation: lastLoc});
}
