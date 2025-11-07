const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
require('./db/db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});