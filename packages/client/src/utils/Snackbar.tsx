import { Alert, Snackbar as MuiSnackbar } from "@mui/material";
import { useSnackbarStore } from "@/store";

export function Snackbar() {
  const {
    isOpen,
    message,
    severity,
    button,
    anchorOrigin,
    closeSnackbar: handleClose,
  } = useSnackbarStore((state) => state);

  return (
    <MuiSnackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        sx={{ width: "100%", bgcolor: `${[severity]}.light` }}
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={severity}
        action={button}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
