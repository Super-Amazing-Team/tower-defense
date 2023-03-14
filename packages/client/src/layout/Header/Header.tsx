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
import { useLayoutStore } from "@/store";

export function Header() {
  const colorMode = useLayoutStore((store) => store.colorMode);
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
              setColorMode(colorMode === "light" ? "dark" : "light");
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
