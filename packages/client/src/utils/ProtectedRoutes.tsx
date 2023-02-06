import { Outlet } from "react-router-dom";
import { useUserStore } from "@/store";
import { Login } from "@/pages/Login";

export const ProtectedRoutes = () => {
  const user = useUserStore((store) => store.user);

  console.log(user);

  // TODO: handle error message with snackbar
  return user.isAuth ? <Outlet /> : <Login />;
};
