import { useState } from 'react';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';

export default function App() {
  const [view, setView] = useState('products');
  const [cartItems, setCartItems] = useState([]);

  const refreshCart = () => {
    fetch('http://localhost:5000/api/cart')
      .then(res => res.json())
      .then(data => setCartItems(data.items));
  };

  return (
    <div className="app-container">
      <header>
        <h1>E-Commerce Shopping Cart</h1>
        <p>Modern shopping experience — built for you.</p>
      </header>
      <nav>
        <button onClick={() => setView('products')}>🛍️ Products</button>
        <button onClick={() => { setView('cart'); refreshCart(); }}>🛒 Cart</button>
      </nav>

      {view === 'products' && <ProductGrid onAddToCart={refreshCart} />}
      {view === 'cart' && cartItems.length > 0 && (
        <Cart onCheckout={(items) => {
          setCartItems(items);
          setView('checkout');
        }} />
      )}
      {view === 'checkout' && (
        <CheckoutForm
          cartItems={cartItems}
          onComplete={() => setView('products')}
        />
      )}
    </div>
  );
}