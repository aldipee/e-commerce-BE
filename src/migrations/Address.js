const db = require('../../utils/db')
const query = `CREATE TABLE IF NOT EXISTS address(
              id TINYINT(2) PRIMARY KEY AUTO_INCREMENT,
              id_user_detail INT NOT NULL,
              city VARCHAR(50) ,
              postcode VARCHAR(10),
              street VARCHAR(30),
              district VARCHAR(30),
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP ,
              CONSTRAINT userd_address FOREIGN KEY(id_user_detail) REFERENCES user_details(id) ON DELETE CASCADE ON UPDATE CASCADE)`
const insert = `INSERT INTO address (id_user_detail, city, postcode, street, district) VALUES (1,'Bogor','44444','Sukapura 3', 'bogor timur')`

db.query(query, function () { db.query(insert) })
console.log(insert)
