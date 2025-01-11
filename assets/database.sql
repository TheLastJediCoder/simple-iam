DROP SCHEMA IF EXISTS simple_iam;
CREATE SCHEMA IF NOT EXISTS simple_iam;

CREATE TABLE IF NOT EXISTS simple_iam.users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(500) NOT NULL UNIQUE,
  password_hash varchar(500) NOT NULL
);

CREATE UNIQUE INDEX simple_iam_email ON simple_iam.users (email);

CREATE TABLE IF NOT EXISTS simple_iam.role_scope_mappings (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scope_id int NOT NULL,
  role_id int NOT NULL
);

CREATE INDEX simple_iam_idx_role_scopes_scope_id ON simple_iam.role_scope_mappings (scope_id);
CREATE INDEX simple_iam_idx_role_scopes_role_id ON simple_iam.role_scope_mappings (role_id);

CREATE TABLE IF NOT EXISTS simple_iam.user_role_mappings (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_id int NOT NULL,
  user_id int NOT NULL
);

CREATE INDEX simple_iam_idx_user_roles_role_id ON simple_iam.user_role_mappings (role_id);
CREATE INDEX simple_iam_idx_user_roles_user_id ON simple_iam.user_role_mappings (user_id);

CREATE TABLE IF NOT EXISTS simple_iam.roles (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS simple_iam.scopes (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(500) NOT NULL,
  type enum(read, create, update, delete) NOT NULL
);

ALTER TABLE simple_iam.role_scope_mappings ADD CONSTRAINT role_scopes_role_id_fk FOREIGN KEY (role_id) REFERENCES simple_iam.roles (id);
ALTER TABLE simple_iam.role_scope_mappings ADD CONSTRAINT role_scopes_scope_id_fk FOREIGN KEY (scope_id) REFERENCES simple_iam.scopes (id);
ALTER TABLE simple_iam.user_role_mappings ADD CONSTRAINT user_roles_role_id_fk FOREIGN KEY (role_id) REFERENCES simple_iam.roles (id);
ALTER TABLE simple_iam.user_role_mappings ADD CONSTRAINT user_roles_user_id_fk FOREIGN KEY (user_id) REFERENCES simple_iam.users (id);