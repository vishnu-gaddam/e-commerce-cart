const express = require('express');
const db = require('../db/db');
const router = express.Router();

router.get('/', (req, res) => {
  const query = `
    SELECT c.id as cartId, p.id, p.name, p.price, c.qty
    FROM cart c
    JOIN products p ON c.productId = p.id
  `;
  db.all(query, [], (err, items) => {
    if (err) return res.status(500).json({ error: err.message });
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({ items, total: parseFloat(total.toFixed(2)) });
  });
});

router.post('/', express.json(), (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || qty < 1) return res.status(400).json({ error: 'Invalid input' });
  db.run('INSERT INTO cart (productId, qty) VALUES (?, ?)', [productId, qty], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, productId, qty });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM cart WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Removed' });
  });
});

router.post('/checkout', express.json(), (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const receipt = {
    id: Math.random().toString(36).substr(2, 9),
    total: parseFloat(total.toFixed(2)),
    timestamp: new Date().toISOString(),
    items: cartItems
  };

  const query = `
  SELECT c.id as cartId, p.id, p.name, p.price, p.image, c.qty
  FROM cart c
  JOIN products p ON c.productId = p.id
`;
  db.run('DELETE FROM cart');
  res.json(receipt);
});

module.exports = router;