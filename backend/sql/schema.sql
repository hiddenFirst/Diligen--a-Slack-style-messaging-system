-- Your DDL statements go here;
DROP TABLE IF EXISTS person CASCADE;
CREATE TABLE person (
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), 
  data jsonb
);

DROP TABLE IF EXISTS workspaces CASCADE;
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb
);

DROP TABLE IF EXISTS person_workspaces CASCADE;
CREATE TABLE person_workspaces (
  person_id UUID REFERENCES person(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  PRIMARY KEY (person_id, workspace_id)
);

DROP TABLE IF EXISTS channels CASCADE;
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  data jsonb
);

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  data jsonb
);