import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { Tabs, Tab, Box, FormControl, InputLabel, Select, MenuItem, Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import PaymentIcon from '@mui/icons-material/Payment';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ButtonGroup from '@mui/material/ButtonGroup';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import AlertMessage from '../library/AlertMessage';
import ModalDialog from '../library/ModalDialog';

const ProductList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingProductIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingProductIndex].quantity += 1;
      updatedCart[existingProductIndex].subtotal = updatedCart[existingProductIndex].quantity * product.price;
      setCartItems(updatedCart);
    } else {
      handleAlertAddOpen(true);
      setCartItems([...cartItems, { ...product, quantity: 1, subtotal: product.price*1 }]);
    }
  };

  const updateCartItem = (itemId, newQuantity) => {

    const existingProductIndex = cartItems.findIndex((item) => item.id === itemId);

    const updatedQuantity = Math.max(newQuantity, 1);

  
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: updatedQuantity } : item
    );

    updatedCart[existingProductIndex].subtotal = updatedCart[existingProductIndex].quantity * updatedCart[existingProductIndex].price;
    setCartItems(updatedCart);
  };


  // Fungsi untuk menghapus item dari keranjang
  const removeFromCart = (itemIndex) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(itemIndex, 1);
    setCartItems(newCartItems);
    handleAlertDeleteOpen(true);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const [deleteItem, setdeleteItem] = useState(false);
  const [addItem, setaddItem] = useState(false);

  const handleAlertDeleteOpen = () => {
    setdeleteItem(true);
 
  };

  const handleAlertAddOpen = () => {
    setaddItem(true);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setdeleteItem(false);
    setaddItem(false);
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



  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/product?category=${selectedTab}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedTab]);





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

          console.log(cartItems);
  
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



  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    console.log("TAB : ",newValue);
 
  };


  useEffect(() => {
    // Panggil API untuk mendapatkan data kategori
    axios.get('http://127.0.0.1:8000/api/productCategory')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []); 


  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [payment, setPayment] = useState('');

  const handleChangePayment = (event) => {
    setPayment(event.target.value);
  };


  const [snapToken, setSnapToken] = useState(null);

  useEffect(() => {
    if (window.snap) {
      window.snap.pay(snapToken);
    } else {
        console.error('Snap object is not defined');
    }
  }, [snapToken]);


  const createTransaction = async () => {

    console.log(calculateTotal());

   // Panggil endpoint Laravel atau server Anda untuk membuat transaksi dan mendapatkan snapToken
    const response = await fetch(`http://127.0.0.1:8000/create-transaction?amount=${calculateTotal()}`);
    const data = await response.json();

    setSnapToken(data.snapToken);

    
  };


  useEffect(() => {
    // Load Midtrans Snap script dynamically
    const loadMidtransScript = () => {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.async = true;
        script.setAttribute('data-client-key', 'SB-Mid-client-rbzyyA7WhA2gPewS'); // Replace with your client key

        document.head.appendChild(script);

        script.onload = () => {
            console.log('Midtrans Snap script loaded');
        };

        script.onerror = () => {
            console.error('Failed to load Midtrans Snap script');
        };
    };

    loadMidtransScript();
}, []); // Empty dependency array ensures the script is loaded only once


  return (


        <div className='row'>
            <div className='col-md-8'>


  
            <ModalDialog open={openModal} handleClose={handleCloseModal}>
              {/* Konten modal di sini */}
              <h2>Modal Content</h2>
              <p>11111111111111111111111111111111111111111111111111111111</p>
            </ModalDialog>

            <AlertMessage open={deleteItem}  handleSnackbarClose={handleSnackbarClose} severity="error" message="item has been deleted into shopping cart" />
            <AlertMessage open={addItem}  handleSnackbarClose={handleSnackbarClose} severity="success" message="item has has been added into shopping cart" />


            <div className='row mb-4'>
            <ThemeProvider theme={theme}>
                <Tabs value={selectedTab} onChange={(event, newValue) => handleTabChange(event, newValue)} variant="fullWidth" >
                <Tab label="All Menu" value={0} key={0}/>
                {categories.map((category,index) => (
                <Tab label={category.category} value={category.id}  key={category.id}/>
                ))}
              </Tabs>
            </ThemeProvider>
            </div>
     

{/*           
            {selectedTab === 1 && <div>Isi Tab 1</div>}
            {selectedTab === 2 && <div>Isi Tab 2</div>}
            {selectedTab === 3 && <div>Isi Tab 3</div>}
            {selectedTab === 4 && <div>Isi Tab 4</div>} */}
          {loading ? (
            // Tampilkan efek loading saat loading masih aktif
              <div className="loader-container">
                <CircularProgress />
              </div>

            ) : (
              <div className='row mb-3'>
                {data.map((item, index) => (
                  <div className="col-md-3 mb-4">
                    <div className="card h-100"  key={item.id} onClick={() => addToCart(item)}>
                    
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
               )}
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

            <div className='col-md-4'>
            <div className="container-cart">
              <h3><i className="bi bi-basket-fill"></i> Shopping Cart</h3>
              {cartItems.map((item, index) => (
              <div className="cart-item" >
                <div className="cart-item-details">
                  <h5>{item.name}</h5>
               
                  <p> 
                  <Badge badgeContent={item.quantity} color="error" style={{ marginRight: '15px' }}>
                  <ShoppingBagIcon />
                </Badge>
                {formatCurrency(item.price)}  = <span className="cart-item-price">{formatCurrency(item.subtotal)}</span></p>
                </div>
                <div className="cart-item-actions">

                <ButtonGroup>
                <Button aria-label="increase" color='info' onClick={() => updateCartItem(item.id, item.quantity + 1)}>
                  <AddIcon fontSize="small" />
                </Button>
                <Button aria-label="reduce" color='info' onClick={() => updateCartItem(item.id, item.quantity - 1)}>
                  <RemoveIcon fontSize="small" />
                </Button>
                <Button aria-label="increase">
                  <DeleteIcon fontSize="small" color='info'  onClick={() => removeFromCart(index)} />
                </Button>
              </ButtonGroup>
                 
                </div>
              </div>
              ))}

            
              <div className="cart-total">
                <h3>Total Amount: <span className="cart-total-price">{formatCurrency(calculateTotal())}</span></h3>
              </div>


              <div className='row py-4'>
              { (calculateTotal() > 0) && (
                <div className='col-md-12'>
                  <FormControl fullWidth >
                  <InputLabel id="payment-label">Payment Method</InputLabel>
                  <Select labelId="payment-label" id="payment" value={payment} label="Select Catgory"  onChange={handleChangePayment}>
                    <MenuItem key="Cash" value="Cash">Cash</MenuItem>
                    <MenuItem key="Cashless" value="Cashless">Cashless</MenuItem>
                  </Select>
                </FormControl>

                { (payment==='Cash') && (
                  <div className="row py-3"><Button variant="contained" startIcon={<ShoppingCartCheckoutIcon />} className="checkout-btn"  onClick={() => handleCreateTransaction(cartItems)} >Create Order</Button></div>
                )}
                   {(payment==='Cashless') && (
                   <div className="row py-3"><Button variant="contained" startIcon={<PaymentIcon />} className="checkout-btn"  onClick={createTransaction} >Payment Proccess</Button></div>
                  )}
                </div>
                  )}
              </div>

            </div>
            </div>
        </div>
   
  );
};

export default ProductList;
