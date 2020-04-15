const db = require('../../utils/db')
const query = `CREATE TABLE IF NOT EXISTS product_details(
                id INT PRIMARY KEY AUTO_INCREMENT,
                id_product INT NOT NULL,
                size INT NOT NULL,
                stock INT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT fk_productdetail FOREIGN KEY (id_product) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE)`

const insert = `INSERT INTO product_details (id_product, size, stock) VALUES (1, 44, 5)`
db.query(query, function () { db.query(insert) })