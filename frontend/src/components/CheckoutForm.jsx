import { useState } from 'react';

export default function CheckoutForm({ cartItems, onComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/cart/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems })
    });
    const data = await res.json();
    setReceipt(data);
  };

  if (receipt) {
    return (
      <div className="receipt-modal">
        <h2>✅ Order Confirmed!</h2>
        <p><strong>Receipt ID:</strong> {receipt.id}</p>
        <p><strong>Total:</strong> ${receipt.total}</p>
        <p><strong>Time:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
        <button onClick={onComplete}>Close</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Full Name"
        required
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        required
      />
      <div className="checkout-buttons">
        <button type="submit">Place Order</button>
        <button type="button" onClick={onComplete}>Cancel</button>
      </div>
    </form>
  );
}