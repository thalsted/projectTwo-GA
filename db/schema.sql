DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;

CREATE TABLE users (
  user_id SERIAL,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255),
  PRIMARY KEY (user_id)
);

CREATE TABLE companies(
  comp_id SERIAL,
  name VARCHAR(50) NOT NULL,
  phase VARCHAR(15) CHECK (phase IN ('Target', 'Engaged', 'Interviewing','Lost','Won')) NOT NULL,
  industry VARCHAR(25),
  description VARCHAR(300),
  url VARCHAR(200),
  user_email VARCHAR(255),
  PRIMARY KEY (comp_id),
  FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE contacts(
  cont_id SERIAL,
  contact_name VARCHAR(50) NOT NULL,
  company_id INTEGER NOT NULL,
  title VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  found_through VARCHAR(50),
  date_created VARCHAR(20),
  note VARCHAR(200),
  PRIMARY KEY (cont_id),
  FOREIGN KEY (company_id) REFERENCES companies(comp_id) ON DELETE CASCADE
);

CREATE TABLE interactions(
  int_id SERIAL,
  contact_id INTEGER NOT NULL,
  interaction_date DATE NOT NULL,
  medium VARCHAR(25),
  type VARCHAR(25),
  notes VARCHAR(400),
  next_status BOOLEAN,
  next_step VARCHAR(100),
  next_date DATE,
  score INTEGER CHECK (score > 0 AND score < 11),
  PRIMARY KEY (int_id),
  FOREIGN KEY (contact_id) REFERENCES contacts(cont_id) ON DELETE CASCADE
);
