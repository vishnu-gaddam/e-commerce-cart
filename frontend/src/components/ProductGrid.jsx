import { useState, useEffect } from 'react';
import { fetchProducts, addToCart } from '../api';

export default function ProductGrid({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    fetchProducts().then(res => {
      setProducts(res.data);
      const init = {};
      res.data.forEach(p => init[p.id] = 1);
      setQuantities(init);
    });
  }, []);

  const changeQty = (id, val) => {
    const num = Math.max(1, parseInt(val) || 1);
    setQuantities(prev => ({ ...prev, [id]: num }));
  };

  const handleAdd = async (p) => {
    const qty = quantities[p.id];
    setAdding(p.id);
    try {
      await addToCart({ productId: p.id, qty });
      onAddToCart();
      setTimeout(() => setAdding(null), 600);
    } catch (err) {
      setAdding(null);
    }
  };

  return (
    <div className="product-grid">
      {products.map(p => (
        <div key={p.id} className="product-card">
<div className="product-image">
  <img
    src={`/images/product${p.id}.jpg`}
    alt={p.name}
    onError={(e) => {
      // Fallback if .jpg doesn't exist → try .png or show placeholder
      e.target.src = "/images/product" + p.id + ".png";
      e.target.onerror = () => {
        e.target.src = "/images/placeholder.jpg"; // final fallback
      };
    }}
  />
</div>
          <div className="product-info">
            <h3 className="product-name">{p.name}</h3>
            <p className="product-price">${p.price.toFixed(2)}</p>
            <div className="qty-selector">
              <button onClick={() => changeQty(p.id, quantities[p.id] - 1)} disabled={quantities[p.id] <= 1}>−</button>
              <input
                type="number"
                min="1"
                value={quantities[p.id]}
                onChange={e => changeQty(p.id, e.target.value)}
                className="qty-input"
              />
              <button onClick={() => changeQty(p.id, quantities[p.id] + 1)}>+</button>
            </div>
          </div>
          <button
            className={`add-btn ${adding === p.id ? 'adding' : ''}`}
            onClick={() => handleAdd(p)}
            disabled={adding === p.id}
          >
            {adding === p.id ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      ))}
    </div>
  );
}