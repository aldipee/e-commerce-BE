const db = require('../../utils/db')

const query = `CREATE TABLE IF NOT EXISTS transactions(
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_user INT NOT NULL,
                status TINYINT(1) DEFAULT 0,
                is_delete TINYINT(1) DEFAULT 0,
                total_price INT,
                postal_fee INT,
                invoice_number VARCHAR(25),
                receipt_number VARCHAR(25),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
                CONSTRAINT trans_user FOREIGN KEY(id_user) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE)`

db.query(query, function () {})
