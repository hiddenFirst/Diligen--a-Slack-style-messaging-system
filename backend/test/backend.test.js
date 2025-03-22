import {beforeAll, afterAll, test} from 'vitest';
import supertest from 'supertest';
import http from 'http';

import * as db from './db.js';
import app from '../src/app.js';

let server;
let request;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll(async () => {
  db.close();
  await server.close();
});

test('Trigger global error handler', async () => {
  await request.get('/api/v0/unknown-endpoint')
      .expect(404);
});

test('GET Login without anything', async () => {
  await request.get('/api/v0/login')
      .set('Authorization', 'Bearer fake_token')
      .expect(404);
});

test('GET General Login', async () => {
  await request
      .get('/api/v0/login?email=tfu18%40ucsc.edu&password=0987654321')
      .set('Authorization', 'Bearer fake_token')
      .expect(200);
});

test('GET General Login Fail', async () => {
  await request
      .get('/api/v0/login?email=tu18%40ucsc.edu&password=987654321')
      .set('Authorization', 'Bearer fake_token')
      .expect(404);
});

test('GET General Login Fail With Empty Value', async () => {
  await request
      .get('/api/v0/login?email=&password=')
      .set('Authorization', 'Bearer fake_token')
      .expect(404);
});

test('GET Login with token', async () => {
  const response = await request
      .get('/api/v0/login?email=tfu18%40ucsc.edu&password=0987654321')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get('/api/v0/login')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('GET Login and find workspaces', async () => {
  const response = await request
      .get('/api/v0/login?email=tfu18%40ucsc.edu&password=0987654321')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get('/api/v0/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('GET Login and find empty workspaces', async () => {
  const response = await request
      .get('/api/v0/login?email=testUser0%40ucsc.edu&password=1234567890')
      .set('Authorization', 'Bearer fake_token');
  console.log('success login');
  console.log('body: ', response.body);
  const token = response.body.token;
  console.log('get token: ', token);
  await request
      .get('/api/v0/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('GET find workspaces with wrong token', async () => {
  await request
      .get('/api/v0/workspaces')
      .set('Authorization', 'Bearer ')
      .expect(404);
});

test('GET Login and find channels for CSE186 workspaces', async () => {
  const response = await request
      .get('/api/v0/login?email=tfu18%40ucsc.edu&password=0987654321')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  const response2 = await request
      .get('/api/v0/workspaces')
      .set('Authorization', `Bearer ${token}`);
  const workspacesId = response2.body[0].id;
  await request
      .get(`/api/v0/channels?workspaces=${workspacesId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('GET Login and missing workspacesId for find channels', async () => {
  const response = await request
      .get('/api/v0/login?email=tfu18%40ucsc.edu&password=0987654321')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get(`/api/v0/channels?workspaces=`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('GET Login and find channels without token', async () => {
  const response = await request
      .get('/api/v0/login?email=tfu18%40ucsc.edu&password=0987654321')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  const response2 = await request
      .get('/api/v0/workspaces')
      .set('Authorization', `Bearer ${token}`);
  const workspacesId = response2.body[0].id;
  await request
      .get(`/api/v0/channels?workspaces=${workspacesId}`)
      .set('Authorization', `Bearer `)
      .expect(404);
});

test('GET Login and empty channels for workspaces', async () => {
  const response = await request
      .get('/api/v0/login?email=testUser%40ucsc.edu&password=1234567890')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  const response2 = await request
      .get('/api/v0/workspaces')
      .set('Authorization', `Bearer ${token}`);
  console.log(response2.body);
  const workspacesId = response2.body[0].id;
  await request
      .get(`/api/v0/channels?workspaces=${workspacesId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('GET Login and message test with valid channelId', async () => {
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get('/api/v0/messages?channelId=fb304b6f-4e0d-4f4b-aa6e-c3a14a83e94e')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('GET Login and message test with empty channelId', async () => {
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get('/api/v0/messages?channelId=')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('GET Login and message test with no channelId', async () => {
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get('/api/v0/messages')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('GET Login and message test with no access channelId', async () => {
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get('/api/v0/messages?channelId=42d762a3-97db-4c8a-8275-31bfc7e3e979')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
});

test('GET Login and no message test with valid channelId', async () => {
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .get('/api/v0/messages?channelId=8c0bcc09-504e-4132-8b18-f8e279388ee3')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
});

test('GET Login and message test with no authorization', async () => {
  await request
      .get('/api/v0/messages?channelId=8c0bcc09-504e-4132-8b18-f8e279388ee3')
      .set('Authorization', `Bearer `)
      .expect(401);
});

test('POST Login and send message', async () => {
  const body = {
    'channelId': 'fb304b6f-4e0d-4f4b-aa6e-c3a14a83e94e',
    'text': 'Hello, this is a message!',
  };
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .post('/api/v0/messages')
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('POST Login and send message, missing channelId', async () => {
  const body = {
    'text': 'Hello, this is a message!',
  };
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .post('/api/v0/messages')
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
});

test('POST Login and send message, no access channelId', async () => {
  const body = {
    'channelId': '06f7894f-2c58-4bd8-b600-0c4ef538d26e',
    'text': 'Hello, this is a message!',
  };
  const response = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .post('/api/v0/messages')
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
});

test('POST Login and send message, no exist channelId', async () => {
  const body = {
    'channelId': '1237894a-2c58-4bd8-0000-0c4ef538d26e',
    'text': 'Hello, this is a message!',
  };
  const response = await request
      .get('/api/v0/login?email=testUser0%40ucsc.edu&password=1234567890')
      .set('Authorization', 'Bearer fake_token');
  const token = response.body.token;
  await request
      .post('/api/v0/messages')
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
});

test('POST Login and send message, no authorization', async () => {
  const body = {
    'channelId': '1237894a-2c58-4bd8-0000-0c4ef538d26e',
    'text': 'Hello, this is a message!',
  };
  await request
      .post('/api/v0/messages')
      .send(body)
      .set('Authorization', `Bearer `)
      .expect(401);
});

test('PUT lastlocation with valid token => 200', async () => {
  // 1) 先登录拿到 token
  const loginRes = await request
      .get('/api/v0/login?email=molly%40books.com&password=mollymember')
      .set('Authorization', 'Bearer fake_token');
  const token = loginRes.body.token;

  // 2) 更新 lastLocation (workspaceId, channelId, messageId)
  const body = {
    workspaceId: '550e8400-e29b-41d4-a716-446655440000',
    channelId: 'fb304b6f-4e0d-4f4b-aa6e-c3a14a83e94e',
    messageId: null,
  };
  await request
      .put('/api/v0/lastlocation')
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
});

test('PUT lastlocation no token => 401', async () => {
  // do not sent token
  const body = {
    workspaceId: '550e8400-e29b-41d4-a716-446655440000',
    channelId: 'fb304b6f-4e0d-4f4b-aa6e-c3a14a83e94e',
  };

  await request
      .put('/api/v0/lastlocation')
      .send(body)
      .set('Authorization', 'Bearer ') // no token
      .expect(401);
});

test('PUT lastlocation invalid token => 403', async () => {
  const body = {
    workspaceId: '550e8400-e29b-41d4-a716-446655440000',
  };

  await request
      .put('/api/v0/lastlocation')
      .send(body)
      .set('Authorization', 'Bearer invalid_token_string')
      .expect(403);
});
