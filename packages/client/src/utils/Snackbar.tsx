import { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Stack,
  Grow,
  AlertTitle,
  Snackbar as MuiSnackbar,
} from "@mui/material";
import { useSnackbarStore, closeToast } from "@/store";

type TToastProps = {
  /**
   * Key to render multiple toasts.
   * This is being set automatically unless specified manually.
   */
  key?: number;
  /**
   * Alert title
   */
  title?: string;
  /**
   * Alert message
   */
  message?: string;
  /**
   * Custom component or html-layout
   */
  children?: React.ReactElement;
  /**
   * Indicates when the alert will disappear in ms. Defaults too 5000.
   * Pass 0 for infinite duration.
   */
  duration?: number;
  /**
   * Alert color
   */
  severity?: "success" | "info" | "warning" | "error";
  /**
   * Alert position on the screen
   */
  position?: {
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right" | "center";
  };
  /**
   * On Close callback
   */
  onClose?: () => void;
};

function SnackbarToast({ toast }: { toast: TToastProps }) {
  const TIMEOUT = 300;

  const [isOpen, setIsOpen] = useState(true);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      closeToast(toast.key);
    }, TIMEOUT);
  }, [toast.key]);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    if (toast?.onClose) {
      toast.onClose();
    }
    close();
  };

  useEffect(() => {
    if (toast.duration !== 0) {
      setTimeout(() => {
        close();
      }, toast.duration || 6000);
    }
  }, [close, toast.duration]);

  return (
    <Grow in={isOpen} timeout={TIMEOUT}>
      <Alert
        key={toast.key}
        severity={toast.severity}
        onClose={handleClose}
        variant="filled"
        sx={{
          minWidth: 280,
          width: { xs: 1, md: "auto" },
          mb: 1,
        }}
      >
        {toast?.title && <AlertTitle>{toast.title}</AlertTitle>}
        {toast?.message}
        {toast?.children}
      </Alert>
    </Grow>
  );
}

export function Snackbar() {
  const toastsPack = useSnackbarStore(({ toastsPack: toasts }) => toasts);

  const firstToast = toastsPack?.[0];

  return (
    <MuiSnackbar
      open={!!firstToast}
      autoHideDuration={null}
      transitionDuration={0}
      anchorOrigin={{
        vertical: firstToast?.position?.vertical || "bottom",
        horizontal: firstToast?.position?.horizontal || "left",
      }}
      sx={{
        mt: "env(safe-area-inset-top)",
        mb: "env(safe-area-inset-bottom)",
      }}
    >
      <Stack flexDirection="column" gap={1}>
        {toastsPack.map((toast) => (
          <SnackbarToast key={toast.key} toast={toast} />
        ))}
      </Stack>
    </MuiSnackbar>
  );
}
