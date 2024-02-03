import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, IconButton,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import AlertDialog from '../library/AlertDialog';
import AlertMessage from '../library/AlertMessage';
import ModalDialog from '../library/ModalDialog';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const TransactionList = () => {
  const [data, setData] = useState([]);
 
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // Sesuaikan dengan jumlah data per halaman yang diinginkan
  const [totalPages, setTotalPages] = useState(1);
 
  const [searchPrice, setsearchPrice] = useState('');
  const [searchQuantity, setsearchQuantity] = useState('');
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');


  const [open, setOpen] = useState(false);
  const [Id, setId] = useState(0);

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




  const handleOpenAlert = (Id) => {
    setOpen(true);
    setId(Id);
    
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };


  const handleDelete = () => {
    axios
    .delete(`http://127.0.0.1:8000/api/transaction/${Id}`)
    .then((response) => {
        console.log("Respon :", response.data);
        setData(data.filter((data) => data.id !== Id));
    })
    .catch((error) => {
        console.error("Error deleting:", error);
    });

    console.log("Data transaction deleted:",Id);
    setOpen(false);
    handleSnackbarOpen(true);
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

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log(event.target.value);
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Lakukan pemanggilan API ke endpoint yang mengimplementasikan paginasi server-side
      const response = await fetch(`http://127.0.0.1:8000/api/transaction?page=${currentPage}&perPage=${perPage}&category=${selectedCategory}&price=${searchPrice}&quantity=${searchQuantity}`);
      const result = await response.json();

      setData(result.data);
      setTotalPages(result.last_page);
      //console.log(searchPrice);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, perPage,searchPrice,searchQuantity,selectedCategory]);



  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };


  const handleSearchPrice = (event) => {
    setsearchPrice(event.target.value);
  };

  const handleSearchQuantity = (event) => {
    setsearchQuantity(event.target.value);
  };


  const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  
    return formatter.format(value);
  };


  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>

              <div style={{ marginBottom: '16px' }}>

      

              <Button onClick={handleOpenModal}>Buka Modal</Button>
      <ModalDialog isOpen={openModal} handleCloseModal={handleCloseModal} />
 
                <FormControl >
                <InputLabel id="category-label">Pilih Kategori</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={selectedCategory}
                  label="Pilih Kategori"
                  onChange={handleChange}
                >
                   <MenuItem key="Select" value="">
                      All Menu
                    </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              

              <TextField id="outlined-basic" label="Price" style={{marginLeft: '16px' }}  value={searchPrice} onChange={handleSearchPrice} variant="outlined" />

              <TextField
                  label="Quantity"
                  variant="outlined"
                  style={{marginRight: '16px',marginLeft: '16px'}}
                  value={searchQuantity} onChange={handleSearchQuantity} 
                />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker  /> 
              </LocalizationProvider>
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
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row,index) => (
                    <TableRow key={index}   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{formatCurrency(row.price)}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{formatCurrency(row.quantity*row.price)}</TableCell>
                      <TableCell>{ format(row.created_at, "dd MMMM yyyy HH:mm")}</TableCell>
                      <TableCell>

                        <IconButton aria-label="Edit" size="small"  onClick={() => handleOpenAlert(row.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="Delete" size="small"  onClick={() => handleOpenAlert(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>


              <AlertDialog open={open} handleCloseAlert={handleCloseAlert} action={handleDelete} title="Confirmation"  message="Are you sure to delete this data?" />
              <AlertMessage open={open2}  severity="info" handleSnackbarClose={handleSnackbarClose} message="Data transactions has been deleted" />
            </TableContainer>

            
 )}
            </div>
          </div>
          <div className='mt-2'>
            <Stack spacing={2}>
              <Pagination   shape="rounded" count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </div>      
    </div>
  );
};

export default TransactionList;
