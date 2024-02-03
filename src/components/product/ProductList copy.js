import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';


const ProductList = () => {
  const [data, setData] = useState([]);

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingProductIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].quantity += 1;
      updatedCart[existingProductIndex].subtotal = updatedCart[existingProductIndex].quantity * product.price;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1, subtotal: product.price*1 }]);
    }
  };

  // Fungsi untuk menghapus item dari keranjang
  const removeFromCart = (itemIndex) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(itemIndex, 1);
    setCartItems(newCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  
    return formatter.format(value);
  };


  const imageUrl = '/product/logo512.png';

  const showAlert = () => {
    Swal.fire('Hello, SweetAlert!', 'This is a success message!', 'warning');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/product');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);





  const handleCreateTransaction = async (cartItems) => {
    Swal.fire({
      title: 'Are you sure to submit this transaction?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/createTransaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cartItems }),
          });
  
          if (response.ok && response.status >= 200 && response.status < 300) {
            // Handle success
            console.log('Cart submitted successfully');
            Swal.fire(
              'Successfully!',
              'Transaction has been successfully submitted.',
              'success'
            );
          } else {
            // Handle errors
            console.error('Failed to submit cart');
            Swal.fire(
              'Error!',
              'Failed to submit transaction.',
              'error'
            );
          }

          setCartItems([]);


        } catch (error) {
          console.error('Error submitting cart:', error);
          Swal.fire(
            'Error!',
            'An unexpected error occurred.',
            'error'
          );
        }
      }
    });
  };
  
  


  return (
    <div>



      <div className="container mt-5">


      <div className='row'>
        <div className='col-md-7'>

          <div className='col-md-3'>
            <div className='row'>
                <div className='col-md-12'>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>QTY</th>
                        <th>Sub Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    {cartItems.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{item.quantity}</td>
                            <td>{formatCurrency(item.subtotal)}</td>
                            <td>
                      
                            <button className="btn btn-danger" onClick={() => removeFromCart(index)}><i class="bi bi-trash3-fill"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <h2>Total: {formatCurrency(calculateTotal())}</h2>

            <div className='row mb-2'>
              <div className='col-md-12'>
                <button type="button" className="btn btn-primary" onClick={() => handleCreateTransaction(cartItems)}>Buat Transaksi</button>
              </div>
            </div>
          </div>
      </div>

        </div>
      </div>
    </div>
  );
};

export default ProductList;
