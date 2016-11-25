DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS interactions;

CREATE TABLE companies(
  id SERIAL,
  name VARCHAR(50) NOT NULL,
  phase VARCHAR(15) CHECK (phase IN ('Target', 'Engaged', 'Interviewing','Lost','Won')) NOT NULL,
  industry VARCHAR(25),
  description VARCHAR(300),
  url VARCHAR(100),
  PRIMARY KEY (id)
);

CREATE TABLE contacts(
  id SERIAL,
  contact_name VARCHAR(50) NOT NULL,
  company_id INTEGER NOT NULL,
  title VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  found_through VARCHAR(50),
  date_created DATE NOT NULL DEFAULT(CURRENT_DATE),
  note VARCHAR(200),
  PRIMARY KEY (id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE interactions(
  id SERIAL,
  contact_id INTEGER NOT NULL,
  interaction_date DATE NOT NULL,
  medium VARCHAR(25),
  type VARCHAR(25),
  notes VARCHAR(400),
  next_status BOOLEAN,
  next_step VARCHAR(100),
  next_date DATE,
  score INTEGER CHECK (score > 0 AND score < 11),
  PRIMARY KEY (id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id)
);
