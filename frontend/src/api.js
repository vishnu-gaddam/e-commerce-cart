import axios from 'axios';

const API = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || "https://e-commerce-cart-e93c.onrender.com") + "/api"
});

export const fetchProducts = () => API.get('/products');
export const getCart = () => API.get('/cart');
export const addToCart = (item) => API.post('/cart', item);
export const removeFromCart = (id) => API.delete(`/cart/${id}`);
export const checkout = (cartItems) =>
  API.post('/checkout', { cartItems });
