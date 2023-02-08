import { ReactNode } from "react";
import { create } from "zustand";
import { TNullable } from "@/utils";

type TSeverity = "success" | "warning" | "error";

type TAnchorOrigin = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};

type TButton = TNullable<ReactNode>;

interface IOpenSnackbarProps {
  message: string;
  severity?: TSeverity;
  button?: TButton;
  anchorOrigin?: TAnchorOrigin;
}

interface IState extends Required<IOpenSnackbarProps> {
  isOpen: boolean;
}

interface IStore extends IState {
  closeSnackbar: () => void;
  openSnackbar: (props: IOpenSnackbarProps) => void;
}

const initialState: IState = {
  isOpen: false,
  message: "",
  severity: "success",
  button: null,
  anchorOrigin: { vertical: "top", horizontal: "right" },
};

/**
 * Extract openSnackbar and use it to call snackbar:
 * @example
 * const openSnackbar = useSnackbarStore(({ openSnackbar }) => openSnackbar)
 * openSnackbar({ message: "hello world!")
 * @example
 * const openSnackbar = useSnackbarStore(({ openSnackbar }) => openSnackbar)
 * openSnackbar({ message: "hello world!", severity: "warning" })
 * @example
 * const openSnackbar = useSnackbarStore(({ openSnackbar }) => openSnackbar)
 * openSnackbar({
 *   message: "hello world!",
 *   severity: "warning",
 *   button: (
 *     <Button onClick={() => console.log("hi!")}>Click me!</Button>
 *   ),
 *   anchorOrigin: {
 *     vertical: "bottom",
 *    horizontal: "right"
 *   }
 * })
 */
export const useSnackbarStore = create<IStore>()((set) => ({
  ...initialState,
  closeSnackbar() {
    set({ isOpen: false });
  },
  openSnackbar({
    message = "",
    severity = "success",
    button = null,
    anchorOrigin = { vertical: "top", horizontal: "right" },
  }: IOpenSnackbarProps) {
    set({
      isOpen: true,
      message,
      severity,
      button,
      anchorOrigin,
    });
  },
}));
