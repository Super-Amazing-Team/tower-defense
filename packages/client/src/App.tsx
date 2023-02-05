import { useMemo } from "react";
import { Box, createTheme, IconButton, ThemeProvider } from "@mui/material";
import CSSBaseLine from "@mui/material/CssBaseline";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import { useLocalStorage, Snackbar } from "@/utils";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Forum } from "@/pages/Forum";
import { Topic } from "@/pages/Topic";
import { Game } from "@/pages/Game";
import { Leaderboard } from "@/pages/Leaderboard";
import { Profile } from "@/pages/Profile";
import { Page404 } from "@/pages/Page404";
import { Page500 } from "@/pages/Page500";

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
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
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
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Page404 />} />
            <Route path="/page500" element={<Page500 />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/game" element={<Game />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/:id" element={<Topic />} />
            </Route>
          </Routes>
        </Box>
        <Snackbar />
      </CSSBaseLine>
    </ThemeProvider>
  );
}

export default App;
