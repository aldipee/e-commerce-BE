require('dotenv').config()
const db = require('../../utils/db')
const query = `CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  is_registered TINYINT(1) DEFAULT 0,
  is_deleted TINYINT(1) DEFAULT 0,
  role_id TINYINT(1) DEFAULT 2,
  verification_code VARCHAR(37),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE  KEY unique_username (username),
  CONSTRAINT role_user FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE NO ACTION ON UPDATE NO ACTION)`

const queryInsert = `INSERT INTO users (username,password,email, is_registered, role_id) VALUES ('${process.env.USER_ADMIN}','${process.env.PASSWORD}','admin@gmail.com',1,1);`
db.query(query, function () {
  db.query(queryInsert)
})

// INSERT INTO user_details (id_user, full_name, gender, phone, balance) VALUES (${LAST_INSERT_ID()}, 'Mamang Kesbor', 1, '08123123123', 1000000);