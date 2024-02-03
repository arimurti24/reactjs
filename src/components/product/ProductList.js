import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { Tabs, Tab, Box, FormControl, InputLabel, Select, MenuItem, Button, IconButton,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import AlertMessage from '../library/AlertMessage';


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
    handleSnackbarOpen(true);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const [deleteItem, setdeleteItem] = useState(false);

  const handleSnackbarOpen = () => {
    setdeleteItem(true);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setdeleteItem(false);
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
      title: 'Are you sure to order this items?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
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
              'Thankyou for your orders.',
              'success'
            );
          } else {
            // Handle errors
            console.error('Failed to submit cart');
            Swal.fire(
              'Error!',
              'Failed to orders.',
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


  const [value, setValue] = useState(0);

  // Fungsi untuk menangani perubahan nilai tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const theme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
          root: {
            backgroundColor: '#ededed',
            color: '#007bff',
          },
        },
      },
    },
  });


  return (


        <div className='row'>
            <div className='col-md-9'>

            <div className='row mb-4'>
            <ThemeProvider theme={theme}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" >
                <Tab label="Makanan" />
                <Tab label="Minuman" />
                <Tab label="Snack" />
                <Tab label="Tambahan" />
              </Tabs>
            </ThemeProvider>
            </div>
     
{/* 
          
            {value === 0 && <div>Isi Tab 1</div>}
            {value === 1 && <div>Isi Tab 2</div>}
            {value === 2 && <div>Isi Tab 3</div>}
            {value === 3 && <div>Isi Tab 4</div>} */}

              <div className='row mb-3'>
                {data.map((item, index) => (
                  <div className="col-md-3 mb-4">
                    <div className="card h-100" onClick={() => addToCart(item)}>
                    
                      <img src={imageUrl} className="card-img-top" alt="Product" />
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">{item.description}</p>
                        <h3><span className="badge rounded-pill bg-secondary d-flex text-center badge-center"> {formatCurrency(item.price)}</span></h3>
                    
                      </div>
                    </div>
                  </div>
                  ))}
              </div>
{/* 

              {data.map((item, index) => (
                <div className='col-md-3 mb-3'>
              <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={imageUrl}
                  alt="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </div>
              ))} */}
 


            </div>
            <div className='col-md-3'>


            <div className="container-cart">
              <h3><i className="bi bi-basket-fill"></i> Shopping Cart</h3>


       

              {cartItems.map((item, index) => (
              <div className="cart-item">
                <div className="cart-item-details">
                  <h5>{item.name}</h5>
                 
                  <p>{formatCurrency(item.price)} x {item.quantity} = <span className="cart-item-price">{formatCurrency(item.subtotal)}</span></p>
                </div>
                <div className="cart-item-actions">
                   <IconButton aria-label="Delete"  size="small"  onClick={() => removeFromCart(index)}>
                    <DeleteIcon />
                  </IconButton>

                 
                </div>
              </div>
              ))}

            <AlertMessage open={deleteItem}  handleSnackbarClose={handleSnackbarClose} severity="success" message="item has been deleted from cart" />

              <div className="cart-total">
                <h3>Total Amount: <span className="cart-total-price">{formatCurrency(calculateTotal())}</span></h3>
              </div>
              <div className="row mt-3">
                <Button variant="contained" startIcon={<ShoppingCartCheckoutIcon />} className="checkout-btn"  onClick={() => handleCreateTransaction(cartItems)} >Order</Button>
              </div>
            </div>

            </div>
        </div>
   
  );
};

export default ProductList;
