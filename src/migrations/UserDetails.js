const db = require('../../utils/db')
require('dotenv').config()

const query = `CREATE TABLE IF NOT EXISTS user_details(
          id INT PRIMARY KEY AUTO_INCREMENT,
          id_user INT NOT NULL,
          full_name VARCHAR(60) NOT NULL,
          date_birth DATE ,
          gender TINYINT(1) ,
          phone VARCHAR(60) NOT NULL,
          balance INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT user_userdetail FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT unique_user UNIQUE (id_user))`
const insert = `INSERT INTO user_details (id_user, full_name, gender, phone, balance) VALUES (1, '${process.env.ADMIN_NAME}', 1, '${process.env.PHONE}', 10000000000)`
db.query(query, function () { db.query(insert) })
