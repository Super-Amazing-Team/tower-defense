import { Outlet } from "react-router-dom";
import { Toolbar, Box } from "@mui/material";
import { Header } from "@/layout/Header";
import { Sidebar } from "@/layout/Sidebar";

export function Layout() {
  return (
    <>
      <Header />
      <Sidebar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, display: "flex" }}>
        <Outlet />
      </Box>
    </>
  );
}
