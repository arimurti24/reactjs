import React from "react"
import { Button, TextField } from "@mui/material";

function EmployeeFormBase({ EmployeeData, handleInputChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <TextField label="Nama Perusahaan" fullWidth name="Employee_name" value={EmployeeData.Employee_name} onChange={handleInputChange} />
      <TextField label="Alamat" fullWidth name="address" value={EmployeeData.address} onChange={handleInputChange} />
      <TextField label="Telepon" fullWidth name="phone" value={EmployeeData.phone} onChange={handleInputChange} />
      <TextField label="Email" fullWidth name="email" value={EmployeeData.email} onChange={handleInputChange} />
      <Button type="submit" variant="contained" color="primary">
        Simpan
      </Button>
    </form>
  );
}

export default EmployeeFormBase;