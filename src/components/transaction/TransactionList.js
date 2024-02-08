import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, IconButton,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';


import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentsIcon from '@mui/icons-material/Payments';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PendingIcon from '@mui/icons-material/Pending';


import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import AlertDialog from '../library/AlertDialog';
import AlertMessage from '../library/AlertMessage';
import ModalDialog from '../library/ModalDialog';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TagOutlined,StarOutlined,SmileOutlined } from '@ant-design/icons';
import { Col, Row, Statistic, Tag, Badge, Card, Space, DatePicker, message,notification,List,Avatar, Popconfirm} from 'antd';

import Pusher from 'pusher-js';


const { RangePicker } = DatePicker;



const TransactionList = () => {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8); // Sesuaikan dengan jumlah data per halaman yang diinginkan
  const [totalPages, setTotalPages] = useState(1);
 
  const [searchPrice, setsearchPrice] = useState('');
  
  const [searchDate, setsearchDate] = useState('');
  const [searchOrderNumber, setsearchOrderNumber] = useState('');
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  

  const [product, setProduct] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);


  const [notifications, setNotifications] = useState([]);
  //const [transactionID, setTransactionID] = useState([0]);

  useEffect(() => {
    const pusher = new Pusher('03d1864ad5274b4139ae', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('notification');

    channel.bind('new_order', notificationData => {
      // Menambahkan notifikasi baru ke dalam array notifications
      setNotifications(prevNotifications => [...prevNotifications, notificationData]);
      console.log(notificationData);
      // Menampilkan notifikasi menggunakan Ant Design
      notification.open({
        type : 'success',
        message: 'Hy there is new order! ',
      
        description: (
          <List
          
          itemLayout="horizontal"
          dataSource={notificationData}
          renderItem={(item,index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={

    
                  <LunchDiningIcon />
                  // (item.id_category==="2") && (<LocalCafeIcon />)
                } />}
                title={item.name}
                description={`${item.quantity} x ${item.price} = ${item.price*item.quantity}`}
              />
            </List.Item>
          )}
        />
        ),
        duration: 7 
      });
    });

    // Membersihkan langganan Pusher saat komponen tidak lagi digunakan
    return () => {
          pusher.unsubscribe('messages');
          pusher.disconnect();
        };
  }, []);


  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const showPopconfirm = () => {
    setOpenConfirm(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpenConfirm(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpenConfirm(false);
  };

  
  const [open, setOpen] = useState(false);
 

  const [open2, setOpen2] = useState(false);

  const handleSnackbarOpen = () => {
    setOpen2(true);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setOpen2(false);
  };





  const handleDelete = (id) => {
    axios.get('http://127.0.0.1:8000/api/get-detail-transaction/'+id)
    .then(response => {

      let qty = parseFloat(response.data.quantity);
      let sub_total = parseFloat(response.data.quantity*response.data.price);
      setTotalQuantity(totalQuantity-qty);
      settotalIncome(totalIncome-sub_total);
    })
    .catch(error => {
      console.error('Error fetching transaction:', error);
  });


    axios
    .delete(`http://127.0.0.1:8000/api/transaction/${id}`)
    .then((response) => {
        console.log("Respon :", response.data);
        message.success('Item has been deleted');
        setData(data.filter((data) => data.id !== id));
        settransactionAmount(transactionAmount-1);
    })
    .catch((error) => {
        console.error("Error deleting:", error);
    });

    console.log("Data transaction deleted:",id);
   
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
  }, []); // Empty dependency array to ensure it runs only once

  const handleChangeCategory = (event) => {
    setSelectedCategory(event.target.value);
    console.log(event.target.value);
  };

  const handleChangeStatus = (event) => {
    setSelectedStatus(event.target.value);
    console.log(event.target.value);
  };

  const handleChangePaymentMethod = (event) => {
    setSelectedPaymentMethod(event.target.value);
    console.log(event.target.value);
  };



  const [filterStartDate, setStartDate] = useState([]);
  const [filterEndDate, setEndDate] = useState([]);

  const handleChangeTransactionDate = (dates) => {
    setStartDate(dates[0]?.format('YYYY-MM-DD'));
    setEndDate(dates[1]?.format('YYYY-MM-DD'));
  };


  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Lakukan pemanggilan API ke endpoint yang mengimplementasikan paginasi server-side
      const response = await fetch(`http://127.0.0.1:8000/api/transaction?page=${currentPage}&perPage=${perPage}&category=${selectedCategory}&status=${selectedStatus}&payment_method=${selectedPaymentMethod}&product=${filteredProducts}&price=${searchPrice}&code=${searchOrderNumber}&startDate=${filterStartDate}&endDate=${filterEndDate}`);
      const result = await response.json();

      setData(result.result.data);
      settransactionAmount(result.transaction_amaount);
      setcashPersentase(result.cash);
      setcashlessPersentase(result.cashless);
      setpendingPersentase(result.pending);
      setTotalQuantity(result.total_quantity);
      settotalIncome(result.total_amount);
      setTotalPages(result.result.last_page);
     // console.log(result.result.data);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, perPage,searchPrice,searchOrderNumber,selectedCategory,selectedStatus,selectedPaymentMethod,filteredProducts,filterStartDate,filterEndDate,notifications]);



  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchDate = (date) =>{
    setsearchDate(date);
    
    //console.log(formatDate(date));
    
  }

  const formatDate = (date) => {
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  };


  const handleSearchPrice = (event) => {
    setsearchPrice(event.target.value);
  };

  const handlesearchOrderNumber = (event) => {
    setsearchOrderNumber(event.target.value);
  };


  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  
    return formatter.format(value);
  };


  useEffect(() => {
    let tot_amount = 0;
    let tot_quantity = 0;
    data.forEach(item => {
      tot_quantity += parseFloat(item.quantity);
      tot_amount += parseFloat(item.price*item.quantity);
    });
    setTotalAmount(tot_amount);
    //setTotalQuantity(tot_quantity);

    const uniqueGroups = new Set(data.map(item => item.order_number));
   
  }, [data]);

  const [transactionAmount, settransactionAmount] = useState(0);
  const [cashPersentase, setcashPersentase] = useState(0);
  const [cashlessPersentase, setcashlessPersentase] = useState(0);
  const [pendingPersentase, setpendingPersentase] = useState(0);
  const [totalIncome, settotalIncome] = useState(0);

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  useEffect(() => {
    // Panggil API untuk mendapatkan product data kategori
    axios.get(`http://127.0.0.1:8000/api/product?category=${selectedCategory}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [selectedCategory]); 


  useEffect(() => {
    //console.log(filteredProducts);
  }, [filteredProducts]);


  const handleProductChange = (event, newInputValue) => {
    // Filter produk berdasarkan nilai input Autocomplete
    const filtered = product.filter((product) =>
      product.name.toLowerCase().includes(newInputValue.toLowerCase())
    );
    //setFilteredProducts(filtered);
  
    
    if (filtered.length === 1) {
      setFilteredProducts(filtered[0].id);
    } else {
      setFilteredProducts('');
    }

  };





  return (
    <div>
     
          <div className='row'>
            <div className='col-md-12'>

              <div>
              {/* <button onClick={handleOpenModal}>Open Modal</button> */}
            <ModalDialog open={openModal} handleClose={handleCloseModal}>
              {/* Konten modal di sini */}
              <h2>Modal Content</h2>
              <p>11111111111111111111111111111111111111111111111111111111</p>
            </ModalDialog>

            <div>
              <h2>Order List</h2>
              
            </div>

              {/* <TextField id="outlined-basic" label="Price" style={{marginLeft: '16px' }}  value={searchPrice} onChange={handleSearchPrice} variant="outlined" />

              <TextField
                  label="Quantity"
                  variant="outlined"
                  style={{marginRight: '16px',marginLeft: '16px'}}
                  value={searchOrderNumber} onChange={handlesearchOrderNumber} 
                />

              <LocalizationProvider  dateAdapter={AdapterDayjs}>
                <DatePicker selected={searchDate}   onChange={handleSearchDate} /> 
              </LocalizationProvider> */}


              </div>


              <div className='py-1'>
                  <Row gutter={[16,16]}>
                    <Col span={4}>
                      <TextField fullWidth
                          label="Order Number"
                          variant="outlined"
                          value={searchOrderNumber} onChange={handlesearchOrderNumber} 
                        />
                    </Col>
                    <Col span={4}>
                      <FormControl fullWidth >
                        <InputLabel id="category-label">Select Category</InputLabel>
                        <Select
                          labelId="category-label"
                          id="category"
                          value={selectedCategory}
                          label="Select Catgory"
                          onChange={handleChangeCategory}
                        >
                          <MenuItem key="Select Category" value="">
                              All Menu
                            </MenuItem>
                          {categories.map(category => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Col>
                    <Col span={4}>
                      <Autocomplete
                          options={product}
                          getOptionLabel={(product) => product.name}
                          onInputChange={handleProductChange}
                          renderInput={(params) => (
                        <TextField {...params} label="Select Product" variant="outlined" />
                        )}
                      />
                    </Col>
                    <Col span={4}>
                      <FormControl fullWidth >
                        <InputLabel id="status-label">Select Status</InputLabel>
                        <Select
                          labelId="status-label"
                          id="status"
                          value={selectedStatus}
                          label="Select Status"
                          onChange={handleChangeStatus}
                        >
                          <MenuItem key="All" value="">All</MenuItem>
                          <MenuItem key="Pending" value="Pending">Pending</MenuItem>
                          <MenuItem key="Settlement" value="Settlement">Settlement</MenuItem>
                        </Select>
                      </FormControl>

                    </Col>
                    <Col span={4}>
                      <FormControl fullWidth >
                        <InputLabel id="payment-method-label">Select Payment Method</InputLabel>
                        <Select
                          labelId="payment-method-label"
                          id="payment-method"
                          value={selectedPaymentMethod}
                          label="Select Payment Method"
                          onChange={handleChangePaymentMethod}
                        >
                          <MenuItem key="All" value="">All</MenuItem>
                          <MenuItem key="Cash" value="Cash">Cash</MenuItem>
                          <MenuItem key="Cashless" value="Cashless">Cashless</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                    <Col span={4}>
                      <RangePicker size="large" onChange={handleChangeTransactionDate} />
                    </Col>
                  </Row>
              </div>

              
              <div className='py-3'>
                  <Row gutter={[16,16]}>
                    <Col span={4}>
                      <Card bordered={false}>
                      <Statistic title="Item Amount" value={transactionAmount} prefix={<PointOfSaleIcon />} />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card bordered={false}>
                      <Statistic title="Total Quantity" value={totalQuantity} prefix={<InventoryIcon />} />
                      </Card>
                    </Col>
                    <Col span={5}>
                      <Card bordered={false}>
                      <Statistic title="Total Amount" value={formatCurrency(totalIncome)} prefix={<PaymentsIcon />} />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card bordered={false}>
                      <Statistic
                        title="Cash"
                        value={cashPersentase}
                        precision={2}
                        valueStyle={{ color: '#4da6ff' }}
                        prefix={<MoneyIcon />}
                        suffix="%"
                      />
                      </Card>
                    </Col>
                    <Col span={4}>
                      <Card bordered={false}>
                        <Statistic
                          title="Cashless"
                          value={cashlessPersentase}
                          precision={2}
                          valueStyle={{ color: '#ffa64d' }}
                          prefix={<CreditCardIcon />}
                          suffix="%"
                        />
                      </Card>
                    </Col>
                    <Col span={3}>
                      <Card bordered={false}>
                        <Statistic
                          title="Pending"
                          value={pendingPersentase}
                          precision={2}
                          valueStyle={{ color: '#cf1322' }}
                          prefix={<PendingIcon />}
                          suffix="%"
                        />
                      </Card>
                    </Col>
                  </Row>
              </div>




            {loading ? (
        // Tampilkan efek loading saat loading masih aktif
        <div className="loader-container">
           <CircularProgress />
        </div>

      ) : (

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row,index) => (
                  
                    <TableRow key={index}   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{row.order_number}</TableCell>
                      <TableCell>{row.name} </TableCell>
                      <TableCell>{formatCurrency(row.price)}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{formatCurrency(row.quantity*row.price)}</TableCell>
                      <TableCell>{ format(row.created_at, "dd MMMM yyyy HH:mm")}</TableCell>
                      <TableCell>
                        {(row.status==='Pending')&&(
                        <Badge status="processing" text="Pending" />
                        )}
                        {(row.status==='Settlement')&&(
                        <Badge status="success" text="Settlement" />
                        )}
                         
                      </TableCell>
                      <TableCell>
                        {(row.payment_method==='Cash')&&(
                        <Tag color="blue">Cash</Tag>
                        )}
                           {(row.payment_method==='Cashless')&&(
                        <Tag color="gold">Cashless</Tag>
                        )}
                      </TableCell>
                      <TableCell>
                        {/* <IconButton aria-label="Edit" size="small"  onClick={() => handleOpenAlert(row.id)}>
                          <EditIcon />
                        </IconButton> */}

                  
                      
                      
                     

                    
                          <Popconfirm
                           placement="leftTop"
                            title="Are you sure to delete this item?"
                            onConfirm={() => handleDelete(row.id)}
                            okText="OK"
                            okButtonProps={{ loading: confirmLoading }}
                            cancelText="Cancel"
                          >
                          <IconButton aria-label="Delete" size="small"  >
                            <DeleteIcon />
                          </IconButton>
                          </Popconfirm>

                      
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
       
          

              {/* <AlertDialog open={open} handleCloseAlert={handleCloseAlert} action={handleDelete} title="Confirmation"  message="Are you sure to delete this data?" /> */}
              <AlertMessage open={open2}  severity="info" handleSnackbarClose={handleSnackbarClose} message="Data transactions has been deleted" />
            </TableContainer>

 )}
            </div>
          </div>
          <div className='py-2'>
            <Stack spacing={2}>
              <Pagination   shape="rounded" count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>    
    </div>
  );
};

export default TransactionList;
