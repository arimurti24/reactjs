import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';

const MyComponent = () => {
  const [data, setData] = useState([]);

  const showAlert = () => {
    Swal.fire('Hello, SweetAlert!', 'This is a success message!', 'warning');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/employee');
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



  const handleDelete = (employeeId) => {

    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Anda tidak akan dapat mengembalikan ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            axios
            .delete(`http://127.0.0.1:8000/api/employee/${employeeId}`)
            .then((response) => {
                console.log("Employ deleted:", response.data);
                setData(data.filter((data) => data.id !== employeeId));
            })
            .catch((error) => {
                console.error("Error deleting Employ:", error);
            });

          Swal.fire(
            'Terhapus!',
            'Data Anda telah dihapus.',
            'success'
          );
        }
    });

  };


  return (
    <div>

    <hr></hr>


       <div>
      <button onClick={showAlert}>Show SweetAlert</button>
    </div>
      
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>NRP</th>
            <th>Age</th>
            <th>Phone Number</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
            <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.nrp}</td>
                <td>{item.age}</td>
                <td>{item.phone_num}</td>
                <td>{item.address}</td>
                <td>
                <button className="btn btn-primary" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
         ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyComponent;
