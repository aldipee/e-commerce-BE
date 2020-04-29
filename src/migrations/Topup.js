const db = require('../../utils/db')
const query = `create table if not exists topup (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NOT NULL,
  nominal INT NOT NULL,
  status TINYINT(1) DEFAULT 0,
  is_deleted TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usertopup FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE)`
  db.query(query, function () {})