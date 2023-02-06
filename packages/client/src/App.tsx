import { useMemo } from "react";
import { Box, createTheme, IconButton, ThemeProvider } from "@mui/material";
import CSSBaseLine from "@mui/material/CssBaseline";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useLocalStorage } from "@/utils/useLocalStorage";
// import { Register } from "@/pages/Register";
// import { Register } from "@/pages/Register";
import { Login } from "@/pages/Login";
// import { Leaderboard } from "@/pages/Leaderboard";

function App() {
  const [mode, setMode] = useLocalStorage("mode", "light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: string) =>
          prevMode === "light" ? "dark" : "light",
        );
      },
    }),
    [setMode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );
  return (
    <ThemeProvider theme={theme}>
      <CSSBaseLine>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Box>
            <IconButton
              sx={{ mx: 1 }}
              onClick={colorMode.toggleColorMode}
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
          <Login />
        </Box>
      </CSSBaseLine>
    </ThemeProvider>
  );
}

export default App;
