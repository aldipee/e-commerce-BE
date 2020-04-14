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
db.query(query, function () {})
