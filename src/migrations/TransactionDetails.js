const db = require('../../utils/db')
const query = `CREATE TABLE IF NOT EXISTS transaction_details (
                id INT PRIMARY KEY AUTO_INCREMENT,
                id_transaction INT NOT NULL,
                id_product INT NOT NULL,
                price INT NOT NULL,
                quantity INT DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT transdetail_trans FOREIGN KEY(id_transaction) REFERENCES transactions(id) ON DELETE RESTRICT ON UPDATE CASCADE,
                CONSTRAINT transdetail_product FOREIGN KEY(id_product) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE)`
db.query(query, function () {})
