import React from "react"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, CssBaseline, Paper, Typography } from "@mui/material";
//import EmployeeList from "./components/employee/list.component";
//import EmployeeForm from "./components/employee/EmployeeForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './styles.css';


import ProductList from "./components/product/ProductList";
import Cart from "./components/product/Cart";

import TransactionList from "./components/transaction/TransactionList";

function App() {
  return (
    <div>
    <div className="container-fluid">
    <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-client-rbzyyA7WhA2gPewS"></script>

      <div className='row mb-4'>
        <div className='col-md-12'>
          <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container-fluid">
              <ul className="navbar-nav">
              <li className="nav-item">
                  <a className="nav-link" href="/TransactionList">Order List</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/">Create New Order</a>
                </li>
                {/* <li className="nav-item">
                  <a className="nav-link" href="#">Lainnya</a>
                </li> */}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      

    <Router>
    <Routes>
      
      <Route path="/" element={<ProductList />} />
      <Route path="/cart" element={<Cart />} />
     <Route path="/TransactionList" element={<TransactionList />} /> 
    </Routes>
  </Router>
  </div>
</div>
  );
}

export default App; 