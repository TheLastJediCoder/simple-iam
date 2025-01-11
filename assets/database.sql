CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(500) NOT NULL UNIQUE,
  password_hash varchar(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS scopes (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scope varchar(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS role_scopes (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  scope_id int NOT NULL,
  role_id int NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  role_id int NOT NULL,
  user_id int NOT NULL
);

ALTER TABLE role_scopes ADD CONSTRAINT role_scopes_scope_id_fk FOREIGN KEY (scope_id) REFERENCES scopes (id);
ALTER TABLE role_scopes ADD CONSTRAINT role_scopes_role_id_fk FOREIGN KEY (role_id) REFERENCES roles (id);
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_id_fk FOREIGN KEY (role_id) REFERENCES roles (id);
ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id);

CREATE INDEX idx_role_scopes_scope_id ON role_scopes (scope_id);
CREATE INDEX idx_role_scopes_role_id ON role_scopes (role_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);
CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);