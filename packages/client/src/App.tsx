import { useMemo } from "react";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import CSSBaseLine from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Snackbar, ProtectedRoutes } from "@/utils";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Forum } from "@/pages/Forum";
import { Topic } from "@/pages/Topic";
import { Game } from "@/pages/Game";
import { Leaderboard } from "@/pages/Leaderboard";
import { Profile } from "@/pages/Profile";
import { Page404 } from "@/pages/Page404";
import { Page500 } from "@/pages/Page500";
import { Layout } from "@/layout";
import { useLayoutStore } from "@/store";

function App() {
  const mode = useLayoutStore((store) => store.colorMode);

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
    <Router>
      <ThemeProvider theme={theme}>
        <CSSBaseLine>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route element={<ProtectedRoutes />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/forum/:id" element={<Topic />} />
                </Route>
              </Route>

              <Route path="/page500" element={<Page500 />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Box>
          <Snackbar />
        </CSSBaseLine>
      </ThemeProvider>
    </Router>
  );
}

export default App;
