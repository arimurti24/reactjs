import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const ModalDialog = ({ isOpen, handleCloseModal }) => {
  const modalBody = (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}
    >
      {/* Isi modal di sini */}
      <h2>Ini Isi Modal</h2>
      <Button onClick={handleCloseModal}>Tutup Modal</Button>
    </Box>
  );

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {modalBody}
    </Modal>
  );
};

export default ModalDialog;
