import { create } from "zustand";

export interface IToastProps {
  key?: number;
  title?: string;
  message: string;
  children?: React.ReactElement;
  duration?: number;
  severity?: "success" | "info" | "warning" | "error";
  position?: {
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right" | "center";
  };
  onClose?: () => void;
}

interface IStore {
  toastsPack: IToastProps[];
}

export const useSnackbarStore = create<IStore>()(() => ({
  toastsPack: [],
}));

/**
 * Add toast ( snackbar ).
 * @param rawToast - can recieve string as message or config object
 * @param severity - can recieve one of the folowing statemetns:
 * "error" | "info" | "warning" | "success"
 * @example
 * addToast("Something went wrong :-("); // second argument is set to "error" by default
 * @example
 * addToast("You're awesome!", "success");
 * @example
 * const options: IToastProps = {
 *  message: "Huge discount on gems!", // NOTE: the only required field
 *  key: 375,
 *  title: "Announcement!",
 *  children: <CustomPreviewComp />,
 *  duration: 15000,
 *  severity: "info",
 *  position: {
 *    vertical: "top",
 *    horizontal: "left",
 *  },
 *  onClose() {
 *    sendInfoToTheServer("Client closed this message");
 *  },
 * };
 *
 * addToast(options);
 */
export function addToast(rawToast: string): void;
export function addToast(
  rawToast: IToastProps,
  severity: IToastProps["severity"],
): void;
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
