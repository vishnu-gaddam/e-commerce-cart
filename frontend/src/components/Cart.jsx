import { useState, useEffect } from 'react';
import { getCart, removeFromCart } from '../api';

export default function Cart({ onCheckout }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    getCart().then(res => setCart(res.data));
  }, []);

  const handleRemove = async (id) => {
    setRemoving(id);
    try {
      await removeFromCart(id);
      const updated = await getCart();
      setCart(updated.data);
    } catch (err) {
      console.error('Remove failed', err);
    } finally {
      setRemoving(null);
    }
  };

  const updateQuantity = async (cartId, productId, newQty) => {
    if (newQty < 1) return;
    try {
      await removeFromCart(cartId);
      await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty: newQty })
      });
      const updated = await getCart();
      setCart(updated.data);
    } catch (err) {
      console.error('Update qty failed', err);
    }
  };

  // Helper to get local image path
  const getProductImagePath = (id) => {
    // Try .jpg first, then .png, then fallback
    return `/images/product${id}.jpg`;
  };

  return (
    <div className="cart-view-content">
      <h2>Your Cart ({cart.items.length} items)</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div
              key={item.cartId}
              className={`cart-item ${removing === item.cartId ? 'removing' : ''}`}
            >
              <div className="item-details">
                <div className="cart-item-image">
                  <img
                    src={getProductImagePath(item.id)}
                    alt={item.name}
                    onError={(e) => {
                      // Fallback to .png if .jpg fails
                      e.target.src = `/images/product${item.id}.png`;
                      e.target.onerror = () => {
                        e.target.src = "/images/placeholder.jpg";
                      };
                    }}
                  />
                </div>
                <div className="item-info">
                  <strong>{item.name}</strong>
                  <div className="item-controls">
                    <div className="cart-qty-selector">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>
                      <span className="cart-qty">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="item-price-per">• ${item.price.toFixed(2)} each</span>
                  </div>
                </div>
              </div>
              <div className="cart-item-actions">
                <div className="item-total">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemove(item.cartId)}
                  className="remove-btn"
                  disabled={removing === item.cartId}
                >
                  {removing === item.cartId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: <span className="total-amount">${cart.total.toFixed(2)}</span></h3>
          </div>
          <button onClick={() => onCheckout(cart.items)} className="checkout-btn">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}