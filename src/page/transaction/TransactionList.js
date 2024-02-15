import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";

import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PendingIcon from "@mui/icons-material/Pending";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import AlertDialog from "../../components/library/AlertDialog";
import AlertMessage from "../../components/library/AlertMessage";
import ModalDialog from "../../components/library/ModalDialog";

import LocalCafeIcon from "@mui/icons-material/LocalCafe";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TagOutlined, StarOutlined, SmileOutlined } from "@ant-design/icons";
import {
  Col,
  Row,
  Statistic,
  Tag,
  Badge,
  Card,
  Space,
  DatePicker,
  message,
  notification,
  List,
  Avatar,
  Popconfirm,
  Modal,
} from "antd";

import NotificationNewOrder from "../../components/NotificationNewOrder";
import NotificationPayment from "../../components/NotificationPayment";

import PusherComponent from "../../components/PusherComponent";
import formatCurrency from "../../components/FormatCurrency";

import EditComponent from "./EditComponent";
import StatisticComponent from "../statistic/StatisticComponent";

const { RangePicker } = DatePicker;

const TransactionList = () => {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8); // Sesuaikan dengan jumlah data per halaman yang diinginkan
  const [totalPages, setTotalPages] = useState(1);
  const [searchDate, setsearchDate] = useState("");
  const [searchOrderNumber, setsearchOrderNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionAmount, settransactionAmount] = useState(0);
  const [cashPersentase, setcashPersentase] = useState(0);
  const [cashlessPersentase, setcashlessPersentase] = useState(0);
  const [pendingPersentase, setpendingPersentase] = useState(0);
  const [totalIncome, settotalIncome] = useState(0);
  const [filterStartDate, setStartDate] = useState([]);
  const [filterEndDate, setEndDate] = useState([]);
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [notificationsNewOrder, setNotificationsNewOrder] = useState([null]);
  const [notificationsPayment, setNotificationsPayment] = useState([null]);

  //const [transactionID, setTransactionID] = useState([0]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const showPopconfirm = () => {
    setOpenConfirm(true);
  };

  const handleNotificationNewOrder = (data) => {
    setNotificationsNewOrder(data);
  };

  const handleNotificationPayment = (data) => {
    setNotificationsPayment(data);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpenConfirm(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpenConfirm(false);
  };

  const [open, setOpen] = useState(false);

  const [open2, setOpen2] = useState(false);

  const handleSnackbarOpen = () => {
    setOpen2(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen2(false);
  };

  const handleDelete = (id) => {
    axios
      .get(
        "https://app.kelasprogrammer.com/company/public/api/get-detail-transaction/" +
          id
      )
      .then((response) => {
        let qty = parseFloat(response.data.quantity);
        let sub_total = parseFloat(
          response.data.quantity * response.data.price
        );
        setTotalQuantity(totalQuantity - qty);
        settotalIncome(totalIncome - sub_total);
      })
      .catch((error) => {
        console.error("Error fetching transaction:", error);
      });

    axios
      .delete(
        `https://app.kelasprogrammer.com/company/public/api/transaction/${id}`
      )
      .then((response) => {
        console.log("Respon :", response.data);
        message.success("Item has been deleted");
        setData(data.filter((data) => data.id !== id));
        settransactionAmount(transactionAmount - 1);
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });

    console.log("Data transaction deleted:", id);
  };

  useEffect(() => {
    // Panggil API untuk mendapatkan data kategori
    axios
      .get("https://app.kelasprogrammer.com/company/public/api/productCategory")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
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

  const handleChangeTransactionDate = (dates) => {
    setStartDate(dates[0]?.format("YYYY-MM-DD"));
    setEndDate(dates[1]?.format("YYYY-MM-DD"));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Lakukan pemanggilan API ke endpoint yang mengimplementasikan paginasi server-side
      const response = await fetch(
        `https://app.kelasprogrammer.com/company/public/api/transaction?page=${currentPage}&perPage=${perPage}&category=${selectedCategory}&status=${selectedStatus}&payment_method=${selectedPaymentMethod}&product=${filteredProducts}&code=${searchOrderNumber}&startDate=${filterStartDate}&endDate=${filterEndDate}`
      );
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
  }, [
    currentPage,
    perPage,
    searchOrderNumber,
    selectedCategory,
    selectedStatus,
    selectedPaymentMethod,
    filteredProducts,
    filterStartDate,
    filterEndDate,
    notificationsNewOrder,
    notificationsPayment,
  ]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchDate = (date) => {
    setsearchDate(date);
  };

  const formatDate = (date) => {
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  };

  const handlesearchOrderNumber = (event) => {
    setsearchOrderNumber(event.target.value);
  };

  useEffect(() => {
    let tot_amount = 0;
    let tot_quantity = 0;
    data.forEach((item) => {
      tot_quantity += parseFloat(item.quantity);
      tot_amount += parseFloat(item.price * item.quantity);
    });
    setTotalAmount(tot_amount);
  }, [data]);

  useEffect(() => {
    // Panggil API untuk mendapatkan product data kategori
    axios
      .get(
        `https://app.kelasprogrammer.com/company/public/api/product?category=${selectedCategory}`
      )
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [selectedCategory]);

  const handleProductChange = (event, newInputValue) => {
    // Filter produk berdasarkan nilai input Autocomplete
    const filtered = product.filter((product) =>
      product.name.toLowerCase().includes(newInputValue.toLowerCase())
    );

    if (filtered.length === 1) {
      setFilteredProducts(filtered[0].id);
    } else {
      setFilteredProducts("");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState();
  const [editProductSelected, setEditProductSelected] = useState();
  const [editQuantity, setEditQuantity] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);

  const handleEdit = (id) => {
    axios
      .get(
        "https://app.kelasprogrammer.com/company/public/api/get-detail-transaction/" +
          id
      )
      .then((response) => {
        setEditItem(response.data);
        setEditProductSelected(response.data.id_product);
        setEditQuantity(response.data.quantity);
      })
      .catch((error) => {
        console.error("Error fetching transaction:", error);
      });

    showModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSaveItem = async (editItem) => {
    try {
      const response = await fetch(
        "https://app.kelasprogrammer.com/company/public/api/edit-item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: editItem, newQuantity: newQuantity }),
        }
      );

      console.log("masuk ke save", newQuantity);
    } catch (error) {
      console.error("Error edit item:", error);
    }

    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleQuantityChange = (event) => {
    setNewQuantity(event.target.value);
  };


 

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <div>
            <div>
              <h2>Order List</h2>
              <PusherComponent
                channel="notification"
                event="new_order"
                handleNotification={handleNotificationNewOrder}
                onDataReceived={NotificationNewOrder}
              />

              {/* <NotificationPayment
                channel="notification"
                event="new_payment"
                handleNotification={handleNotificationPayment}
                onDataReceived={NotificationPayment}
              /> */}
            </div>
          </div>

          <div className="py-1">
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <TextField
                  fullWidth
                  label="Order Number"
                  variant="outlined"
                  value={searchOrderNumber}
                  onChange={handlesearchOrderNumber}
                />
              </Col>
              <Col span={4}>
                <FormControl fullWidth>
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
                    {categories.map((category) => (
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
                    <TextField
                      {...params}
                      label="Select Product"
                      variant="outlined"
                    />
                  )}
                />
              </Col>
              <Col span={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Select Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={selectedStatus}
                    label="Select Status"
                    onChange={handleChangeStatus}
                  >
                    <MenuItem key="All" value="">
                      All
                    </MenuItem>
                    <MenuItem key="Pending" value="Pending">
                      Pending
                    </MenuItem>
                    <MenuItem key="Settlement" value="Settlement">
                      Settlement
                    </MenuItem>
                  </Select>
                </FormControl>
              </Col>
              <Col span={4}>
                <FormControl fullWidth>
                  <InputLabel id="payment-method-label">
                    Select Payment Method
                  </InputLabel>
                  <Select
                    labelId="payment-method-label"
                    id="payment-method"
                    value={selectedPaymentMethod}
                    label="Select Payment Method"
                    onChange={handleChangePaymentMethod}
                  >
                    <MenuItem key="All" value="">
                      All
                    </MenuItem>
                    <MenuItem key="Cash" value="Cash">
                      Cash
                    </MenuItem>
                    <MenuItem key="Cashless" value="Cashless">
                      Cashless
                    </MenuItem>
                  </Select>
                </FormControl>
              </Col>
              <Col span={4}>
                <RangePicker
                  size="large"
                  onChange={handleChangeTransactionDate}
                />
              </Col>
            </Row>
          </div>

          <div className="py-3">
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <Card bordered={false}>
                  <Statistic
                    title="Item Amount"
                    value={transactionAmount}
                    prefix={<PointOfSaleIcon />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Quantity"
                    value={totalQuantity}
                    prefix={<InventoryIcon />}
                  />
                </Card>
              </Col>
              <Col span={5}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Amount"
                    value={formatCurrency(totalIncome)}
                    prefix={<PaymentsIcon />}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card bordered={false}>
                  <Statistic
                    title="Cash"
                    value={cashPersentase}
                    precision={2}
                    valueStyle={{ color: "#4da6ff" }}
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
                    valueStyle={{ color: "#ffa64d" }}
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
                    valueStyle={{ color: "#cf1322" }}
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
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
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
                  {data.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.order_number}</TableCell>
                      <TableCell>{row.name} </TableCell>
                      <TableCell>{formatCurrency(row.price)}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(row.quantity * row.price)}
                      </TableCell>
                      <TableCell>
                        {format(row.created_at, "dd MMMM yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        {row.status === "Pending" && (
                          <Badge status="processing" text="Pending" />
                        )}
                        {row.status === "Settlement" && (
                          <Badge status="success" text="Settlement" />
                        )}
                      </TableCell>
                      <TableCell>
                        {row.payment_method === "Cash" && (
                          <Tag color="blue">Cash</Tag>
                        )}
                        {row.payment_method === "Cashless" && (
                          <Tag color="gold">Cashless</Tag>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="Edit"
                          size="small"
                          onClick={() => handleEdit(row.id)}
                        >
                          <EditIcon />
                        </IconButton>

                        <Popconfirm
                          placement="leftTop"
                          title="Are you sure to delete this item?"
                          onConfirm={() => handleDelete(row.id)}
                          okText="OK"
                          okButtonProps={{ loading: confirmLoading }}
                          cancelText="Cancel"
                        >
                          <IconButton aria-label="Delete" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Popconfirm>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Modal
                title="Edit Item"
                open={isModalOpen}
                footer={[
                  <Button key="submit" type="primary" onClick={handleSaveItem}>
                    Save
                  </Button>,
                  <Button key="back" onClick={handleCancelModal}>
                    Cancel
                  </Button>,
                ]}
              >
                asas
              </Modal>

              {/* <AlertDialog open={open} handleCloseAlert={handleCloseAlert} action={handleDelete} title="Confirmation"  message="Are you sure to delete this data?" /> */}
              <AlertMessage
                open={open2}
                severity="info"
                handleSnackbarClose={handleSnackbarClose}
                message="Data transactions has been deleted"
              />
            </TableContainer>
          )}
        </div>
      </div>
      <div className="py-2">
        <Stack spacing={2}>
          <Pagination
            shape="rounded"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Stack>
      </div>

      <StatisticComponent />
    </div>
  );
};

export default TransactionList;
