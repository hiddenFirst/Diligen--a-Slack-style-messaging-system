-- Your data insert statements go here;
DELETE FROM person;

INSERT INTO person(id, data)
VALUES ('5abab7ef-2da6-41fc-9323-e0e41ba4a369',
    '{
      "email": "tfu18@ucsc.edu",
      "pwhash": "$2a$10$48cKZCQQ8Xcx2mBQRLv4P.sr6A5d7n41yqiwq9IKyPk3Kkkd9qzQa",
      "name": "Jackie",
      "lastLocation": {
        "workspaceId": null,
        "channelId": null,
        "messageId": null
      }
    }'
);

INSERT INTO person(id, data)
VALUES ('e8db3d22-18ef-458d-8379-290a35cad547',
    '{
      "email": "molly@books.com",
      "pwhash": "$2a$10$UmnOdIvZIi2PMH2HW0NYwum3fbR3g3aSrbLMIpZMT0qMsCmrFGI8e",
      "name": "molly",
      "lastLocation": {
        "workspaceId": null,
        "channelId": null,
        "messageId": null
      }
    }'
);

INSERT INTO person(id, data)
VALUES ('ba495980-bdfa-4dd5-b5a9-d083e8b9bd23',
    '{
      "email": "anna@books.com",
      "pwhash": "$2a$10$wr9sL8K/fXkogfujMu3cfeoCsEbq4Rmcr1qyl4w8C5ObJG48uuY8q",
      "name": "anna",
      "lastLocation": {
        "workspaceId": null,
        "channelId": null,
        "messageId": null
      }
    }'
);

INSERT INTO person(id, data)
VALUES ('5da15110-9ebb-4f59-ab1f-a530e555c478',
    '{
      "email": "testUser0@ucsc.edu",
      "pwhash": "$2a$10$mGPa6gpGPTXK2Um8gKpCU.pBZSiUb6yHuZQO8U6HUHunzvXT2C0eC",
      "name": "user1",
      "lastLocation": {
        "workspaceId": null,
        "channelId": null,
        "messageId": null
      }
    }'
);

INSERT INTO person(id, data)
VALUES ('e3c82035-c1f3-48e7-a88b-255da649ec03',
    '{
      "email": "testUser@ucsc.edu",
      "pwhash": "$2a$10$mGPa6gpGPTXK2Um8gKpCU.pBZSiUb6yHuZQO8U6HUHunzvXT2C0eC",
      "name": "user2",
      "lastLocation": {
        "workspaceId": null,
        "channelId": null,
        "messageId": null
      }
    }'
);

DELETE FROM workspaces;

INSERT INTO workspaces(id, data)
VALUES ('53db5076-8794-4062-af34-f76cfec76f95',
    '{
      "name": "CSE186"
    }'
);

INSERT INTO workspaces(id, data)
VALUES ('9b479c04-49b4-4385-aa8d-3513ed94af32',
    '{
      "name": "CSE180"
    }'
);

INSERT INTO workspaces(id, data)
VALUES ('f56e0154-3a6a-44a0-b2c9-c207cc80b263',
    '{
      "name": "General"
    }'
);

INSERT INTO workspaces(id, data)
VALUES ('cc9f1594-dd04-415f-8c08-11d2a7807b19',
    '{
      "name": "Slug Sport"
    }'
);

INSERT INTO workspaces(id, data)
VALUES ('aa9f1594-dd04-416f-8c08-11d3a7807b20',
    '{
      "name": "test workspace"
    }'
);


DELETE FROM person_workspaces;

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('5abab7ef-2da6-41fc-9323-e0e41ba4a369', '53db5076-8794-4062-af34-f76cfec76f95');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('5abab7ef-2da6-41fc-9323-e0e41ba4a369', 'f56e0154-3a6a-44a0-b2c9-c207cc80b263');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('e8db3d22-18ef-458d-8379-290a35cad547', '53db5076-8794-4062-af34-f76cfec76f95');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('e8db3d22-18ef-458d-8379-290a35cad547', '9b479c04-49b4-4385-aa8d-3513ed94af32');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('e8db3d22-18ef-458d-8379-290a35cad547', 'f56e0154-3a6a-44a0-b2c9-c207cc80b263');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('ba495980-bdfa-4dd5-b5a9-d083e8b9bd23', '53db5076-8794-4062-af34-f76cfec76f95');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('ba495980-bdfa-4dd5-b5a9-d083e8b9bd23', '9b479c04-49b4-4385-aa8d-3513ed94af32');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('ba495980-bdfa-4dd5-b5a9-d083e8b9bd23', 'cc9f1594-dd04-415f-8c08-11d2a7807b19');

INSERT INTO person_workspaces (person_id, workspace_id)
VALUES ('e3c82035-c1f3-48e7-a88b-255da649ec03', 'aa9f1594-dd04-416f-8c08-11d3a7807b20');

--insert channels
DELETE FROM channels;

INSERT INTO channels(id, workspace_id, data)
VALUES ('fb304b6f-4e0d-4f4b-aa6e-c3a14a83e94e', '53db5076-8794-4062-af34-f76cfec76f95',
    '{
      "name": "Assignment1"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('51d28624-fde2-4af2-bdff-1f3e3cd6e0bf', '53db5076-8794-4062-af34-f76cfec76f95',
    '{
      "name": "Assignment2"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('4f699578-58df-461f-b8ad-71e3d7ae61a5', '53db5076-8794-4062-af34-f76cfec76f95',
    '{
      "name": "Assignment3"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('17b6f260-3d24-4988-95c4-02239225425a', '53db5076-8794-4062-af34-f76cfec76f95',
    '{
      "name": "Assignment4"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('8c0bcc09-504e-4132-8b18-f8e279388ee3', '9b479c04-49b4-4385-aa8d-3513ed94af32',
    '{
      "name": "Lab1"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('4cc24fe2-26c2-463f-a84d-e7dee0c363ef', '9b479c04-49b4-4385-aa8d-3513ed94af32',
    '{
      "name": "Lab2"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('a0446df3-90ca-470f-a5a0-517745583ebd', '9b479c04-49b4-4385-aa8d-3513ed94af32',
    '{
      "name": "Lab3"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('5d9d09fe-0b52-4f56-b41d-2970a95ca5ef', '9b479c04-49b4-4385-aa8d-3513ed94af32',
    '{
      "name": "Lab4"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('0ce27d32-5fda-413f-a8d5-cdf17dde02a1', 'f56e0154-3a6a-44a0-b2c9-c207cc80b263',
    '{
      "name": "ask-for-help"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('12c09b6f-660b-4404-bff0-81fd3223825a', 'f56e0154-3a6a-44a0-b2c9-c207cc80b263',
    '{
      "name": "about-you"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('4bdff06b-d263-484f-a10b-de610faf7043', 'f56e0154-3a6a-44a0-b2c9-c207cc80b263',
    '{
      "name": "event"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('d60034b1-12cb-4958-adf7-478a743df383', 'f56e0154-3a6a-44a0-b2c9-c207cc80b263',
    '{
      "name": "gernal"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('d8b6cfbd-5a67-49a3-9477-73fd86528bd9', 'cc9f1594-dd04-415f-8c08-11d2a7807b19',
    '{
      "name": "basketball"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('06f7894f-2c58-4bd8-b600-0c4ef538d26e', 'cc9f1594-dd04-415f-8c08-11d2a7807b19',
    '{
      "name": "football"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('42d762a3-97db-4c8a-8275-31bfc7e3e979', 'cc9f1594-dd04-415f-8c08-11d2a7807b19',
    '{
      "name": "fencing"
    }'
);

INSERT INTO channels(id, workspace_id, data)
VALUES ('d6373ffa-c7f5-40d9-a109-b8096b49a92d', 'cc9f1594-dd04-415f-8c08-11d2a7807b19',
    '{
      "name": "gernal"
    }'
);

--messages
DELETE FROM messages;

INSERT INTO messages(id, channel_id, data)
VALUES ('b9ee8737-74fa-4fb4-83e0-da598de54f77', 'fb304b6f-4e0d-4f4b-aa6e-c3a14a83e94e',
    '{
      "text": "Welcome to channel!",
      "sender": "molly",
      "timestamp": "2024-03-07T12:00:00Z",
      "UserEmail": "molly@books.com",
      "thread": []
    }'
);

INSERT INTO messages(id, channel_id, data)
VALUES ('d8b6b450-c1de-4f70-aa2b-a2b8aed023ff', '51d28624-fde2-4af2-bdff-1f3e3cd6e0bf',
    '{
      "text": "Welcome to channel!",
      "sender": "molly",
      "timestamp": "2024-03-07T12:00:00Z",
      "UserEmail": "molly@books.com",
      "thread": []
    }'
);

INSERT INTO messages(id, channel_id, data)
VALUES ('8f08f107-b653-4489-b9b1-f5cfb9571f02', '4f699578-58df-461f-b8ad-71e3d7ae61a5',
    '{
      "text": "Welcome to channel!",
      "sender": "molly",
      "timestamp": "2024-03-07T12:00:00Z",
      "UserEmail": "molly@books.com",
      "thread": []
    }'
);

INSERT INTO messages(id, channel_id, data)
VALUES ('50e84040-5326-4ccb-b431-db3bd9c395ab', '17b6f260-3d24-4988-95c4-02239225425a',
    '{
      "text": "Welcome to channel!",
      "sender": "molly",
      "timestamp": "2024-03-07T12:00:00Z",
      "UserEmail": "molly@books.com",
      "thread": []
    }'
);
