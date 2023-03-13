import { useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import {
  Brightness7,
  Brightness4,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
// import { useLayoutStore } from "@/store";
import { MyContext } from "@/App";

export function Header() {
  const useLayoutStore = useContext(MyContext).useLayoutStore;
  const colorModeFunc = useLayoutStore((store) => store.colorModeFunc);
  const setColorMode = useLayoutStore((store) => store.setColorMode);
  const isOpenSidebar = useLayoutStore((store) => store.openSidebar);
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar);
  const theme = useTheme();

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          {isOpenSidebar ? <Close /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          tower-defense
        </Typography>
        <Box>
          <IconButton
            sx={{ mx: 1 }}
            onClick={() => {
              setColorMode(colorModeFunc() === "light" ? "dark" : "light");
            }}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {theme.palette.mode} mode
        </Box>
      </Toolbar>
    </AppBar>
  );
}
