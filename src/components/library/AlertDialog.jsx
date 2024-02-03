// AlertDialog.jsx
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({ open, handleCloseAlert, message, title,action }) => {
  return (
    <Dialog open={open} onClose={handleCloseAlert}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCloseAlert}>No</Button>
          <Button onClick={action} autoFocus>
            Yes
          </Button>
        </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
