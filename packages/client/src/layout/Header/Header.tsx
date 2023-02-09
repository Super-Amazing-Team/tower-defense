import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTheme } from "@mui/material";
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
          onClick={() => {
            toggleSidebar();
          }}
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
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          {theme.palette.mode} mode
        </Box>
      </Toolbar>
    </AppBar>
  );
}
