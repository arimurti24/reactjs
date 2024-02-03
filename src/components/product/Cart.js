// Cart.js

import React, { useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Fungsi untuk menambahkan item ke keranjang
  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  // Fungsi untuk menghapus item dari keranjang
  const removeFromCart = (itemIndex) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(itemIndex, 1);
    setCartItems(newCartItems);
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item} 
            <button onClick={() => removeFromCart(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
