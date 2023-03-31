import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "@/store";
import { TRoutes as R } from "@/types";

export const ProtectedRoutes = () => {
  const location = useLocation();
  const { isAuth } = useUserStore((store) => store.user);

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export const ProtectedToAuth = () => {
  const location = useLocation();
  const { isAuth } = useUserStore((store) => store.user);

  return isAuth ? (
    <Navigate to={R.game} state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};
