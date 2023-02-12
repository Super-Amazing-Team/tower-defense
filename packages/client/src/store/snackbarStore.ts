import { create } from "zustand";

export interface IToastProps {
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
  message: string;
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
}

interface IStore {
  toastsPack: IToastProps[];
}

export const useSnackbarStore = create<IStore>()(() => ({
  toastsPack: [],
}));

export function addToast(
  rawToast: IToastProps | string,
  severity: IToastProps["severity"] = "error",
) {
  let newToast: IToastProps;

  if (typeof rawToast === "string") {
    const defaultToast: IToastProps = {
      key: Date.now(),
      message: rawToast,
      severity,
      position: {
        vertical: "bottom",
        horizontal: "right",
      },
    };

    newToast = defaultToast;
  } else {
    rawToast.key ??= Date.now();
    if (severity) {
      rawToast.severity = severity;
    }
    newToast = rawToast;
  }

  const { key } = newToast;

  useSnackbarStore.setState((store) => {
    const { toastsPack } = store;
    if (toastsPack.find((toast) => toast.key === key)) {
      return store;
    }
    const rest = toastsPack.length < 3 ? toastsPack : toastsPack.slice(0, -1);
    return {
      toastsPack: [{ ...newToast, key }, ...rest],
    };
  });
}

export function closeToast(key: IToastProps["key"]) {
  useSnackbarStore.setState(({ toastsPack }) => ({
    toastsPack: toastsPack.filter((toast) => toast.key !== key),
  }));
}
