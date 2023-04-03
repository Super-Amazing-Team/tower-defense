import React, { useEffect, useMemo } from "react";
import { Box, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { TRoutes as R } from "./types";
import {
  Snackbar,
  ProtectedRoutes,
  ProtectedToAuth,
  ErrorBoundary,
} from "@/utils";
import {
  Home,
  Login,
  Register,
  Forum,
  Game,
  Topic,
  Leaderboard,
  Profile,
  Page404,
  Page500,
} from "@/pages";
import { TDEngine } from "@/pages/Game/engine/TDEngine";
import { Layout } from "@/layout";
import { useLayoutStore, useUserStore } from "@/store";

const engine = new TDEngine();
const App = () => {
  const mode = useLayoutStore((store) => store.colorMode);
  const fetchUser = useUserStore((store) => store.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
      <CssBaseline>
        <ErrorBoundary>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              minWidth: "100vh",
            }}
          >
            <Routes>
              <Route element={<Layout />}>
                <Route element={<ProtectedToAuth />}>
                  <Route path={R.login} element={<Login />} />
                  <Route path={R.register} element={<Register />} />
                </Route>
                <Route path={R.leaderboard} element={<Leaderboard />} />
                <Route element={<ProtectedRoutes />}>
                  <Route path={R.game} element={<Game engine={engine} />} />
                  <Route path={R.profile} element={<Profile />} />
                  <Route path={R.forum} element={<Forum />} />
                  <Route path={R.topic} element={<Topic />} />
                </Route>
              </Route>

              <Route path={R.home} element={<Home />} />
              <Route path={R.page500} element={<Page500 />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Box>
          <Snackbar />
        </ErrorBoundary>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
