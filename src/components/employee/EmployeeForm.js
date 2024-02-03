import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import EmployeeFormBase from "./EmployeeFormBase";
import axios from "axios";

function EmployeeForm() {
  const navigate = useNavigate();
  const [EmployeeData, setEmployeeData] = useState({
    Employee_name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8001/api/companies", EmployeeData)
      .then((response) => {
        console.log("Employee added:", response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding Employee:", error);
        navigate("/");
      });
  };

  return (
    <div>
      <h2>Add New Employee</h2>
      <EmployeeFormBase EmployeeData={EmployeeData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
    </div>
  );
}

export default EmployeeForm;