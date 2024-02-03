
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AlertMessage = ({ open, handleSnackbarClose, message,severity }) => {
  return (
  <Snackbar
    open={open}
    autoHideDuration={1100} // Adjust as needed
    onClose={handleSnackbarClose}
    >
    <MuiAlert
      elevation={6}
      variant="filled"
      onClose={handleSnackbarClose}
      severity={severity} // You can use 'error', 'warning', 'info', or 'success'
    >
      {message}
    </MuiAlert>
  </Snackbar>

);
};

export default AlertMessage;