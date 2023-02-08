import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Header } from "@/layout/Header";
import { Sidebar } from "@/layout/Sidebar";

export function Layout() {
  return (
    <>
      <Header />
      <Sidebar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: "flex" }}>
        <Outlet />
      </Box>
    </>
  );
}
