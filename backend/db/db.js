const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cart.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    qty INTEGER,
    FOREIGN KEY(productId) REFERENCES products(id)
  )`);

  // Always reload products for demo
  const products = require('../data/products.json');
  db.run('DELETE FROM products');
  const stmt = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');
  products.forEach(p => stmt.run(p.id, p.name, p.price));
  stmt.finalize();
  console.log(`✅ Loaded ${products.length} products.`);
});

module.exports = db;