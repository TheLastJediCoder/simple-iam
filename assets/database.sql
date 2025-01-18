DROP SCHEMA IF EXISTS simple_iam;

CREATE SCHEMA IF NOT EXISTS simple_iam;

USE simple_iam;

CREATE TABLE IF NOT EXISTS simple_iam.roles (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(500) NOT NULL
);

CREATE UNIQUE INDEX simple_iam_PRIMARY ON simple_iam.roles (id);

CREATE TABLE IF NOT EXISTS user_tokens (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  access_token varchar(500) NOT NULL,
  access_token_expires_at datetime NOT NULL,
  user_id int NOT NULL,
  refresh_token varchar(500) NOT NULL,
  refresh_token_expires_at datetime DEFAULT NULL,
  is_revoked TINYINT(1) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS simple_iam.roles_scopes (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scope_id int NOT NULL,
  role_id int NOT NULL
);

CREATE UNIQUE INDEX simple_iam_PRIMARY ON simple_iam.roles_scopes (id);
CREATE INDEX simple_iam_simple_iam_idx_role_scopes_scope_id ON simple_iam.roles_scopes (scope_id);
CREATE INDEX simple_iam_simple_iam_idx_role_scopes_role_id ON simple_iam.roles_scopes (role_id);

CREATE TABLE IF NOT EXISTS simple_iam.scopes (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(500) NOT NULL,
  type enum('get', 'list', 'create','update', 'delete') NOT NULL
);

CREATE UNIQUE INDEX simple_iam_PRIMARY ON simple_iam.scopes (id);

CREATE TABLE IF NOT EXISTS simple_iam.users_roles (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_id int NOT NULL,
  user_id int NOT NULL
);

CREATE UNIQUE INDEX simple_iam_PRIMARY ON simple_iam.users_roles (id);
CREATE INDEX simple_iam_simple_iam_idx_user_roles_role_id ON simple_iam.users_roles (role_id);
CREATE INDEX simple_iam_simple_iam_idx_user_roles_user_id ON simple_iam.users_roles (user_id);

CREATE TABLE IF NOT EXISTS simple_iam.users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(500) NOT NULL UNIQUE,
  password_hash varchar(500) NOT NULL
);

CREATE UNIQUE INDEX simple_iam_PRIMARY ON simple_iam.users (id);
CREATE UNIQUE INDEX simple_iam_email ON simple_iam.users (email);

ALTER TABLE user_tokens ADD CONSTRAINT access_tokens_user_id_fk FOREIGN KEY (user_id) REFERENCES simple_iam.users (id);
ALTER TABLE simple_iam.roles_scopes ADD CONSTRAINT role_scopes_role_id_fk FOREIGN KEY (role_id) REFERENCES simple_iam.roles (id);
ALTER TABLE simple_iam.roles_scopes ADD CONSTRAINT role_scopes_scope_id_fk FOREIGN KEY (scope_id) REFERENCES simple_iam.scopes (id);
ALTER TABLE simple_iam.users_roles ADD CONSTRAINT user_roles_role_id_fk FOREIGN KEY (role_id) REFERENCES simple_iam.roles (id);
ALTER TABLE simple_iam.users_roles ADD CONSTRAINT user_roles_user_id_fk FOREIGN KEY (user_id) REFERENCES simple_iam.users (id);