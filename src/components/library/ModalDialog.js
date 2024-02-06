// Modal.js
import React from 'react';
import { Modal as MuiModal, Backdrop, Fade, Button } from '@mui/material';
import PropTypes from 'prop-types';

const Modal = ({ open, handleClose, children }) => {
  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        invisible: false, // Atur ke false agar latar belakang terlihat
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, // Sesuaikan dengan warna yang diinginkan
      }}
    >
      <Fade in={open}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 0,
            backgroundColor: 'white', // Atur warna latar belakang konten modal
            padding: '20px', // Sesuaikan dengan kebutuhan
          }}
        >
          {children}
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Fade>
    </MuiModal>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
