const db = require('../../utils/db')
const query = `CREATE TABLE IF NOT EXISTS categories(
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                thumbnail TEXT,
                is_deleted TINYINT(1) DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
              )`

const insert = `INSERT INTO categories (name) VALUES ('sneaker');`

// INSERT INTO categories (name) VALUES ('sport');
// INSERT INTO categories (name) VALUES ('casual');

db.query(query, function () { db.query(insert) })
