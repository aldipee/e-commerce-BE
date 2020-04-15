const db = require('../../utils/db')
const query = `CREATE TABLE IF NOT EXISTS products(
               id INT PRIMARY KEY AUTO_INCREMENT,
               id_category INT NOT NULL,
               name VARCHAR(200) NOT NULL,
               price INT NOT NULL,
               picture TEXT,
               is_deleted TINYINT(1) DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
              CONSTRAINT product_category FOREIGN KEY(id_category) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE)`
const insert = `INSERT INTO products (id_category, name, price) VALUES (1, 'Vans footwear classic', 850000)`
db.query(query, function () { db.query(insert) })
