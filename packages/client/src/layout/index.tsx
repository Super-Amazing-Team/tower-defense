import { Outlet, useLocation } from "react-router-dom";
import { Toolbar, Box } from "@mui/material";
import { TRoutes as R } from "@/types";
import { Header } from "@/layout/Header";
import { Sidebar } from "@/layout/Sidebar";

export function Layout() {
  const location = useLocation();
  return location.pathname !== R.game ? (
    <>
      <Header />
      <Sidebar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, display: "flex", p: 3 }}>
        <Outlet />
      </Box>
    </>
  ) : (
    <Box component="main" sx={{ flexGrow: 1, display: "flex" }}>
      <Outlet />
    </Box>
  );
}
