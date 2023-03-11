import React, {
  ComponentType,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import CSSBaseLine from "@mui/material/CssBaseline";
import { Routes, Route } from "react-router-dom";
import { TRoutes as R } from "./types";
import {
  Snackbar,
  ProtectedRoutes,
  ProtectedToAuth,
  ErrorBoundary,
} from "@/utils";
import {
  Login,
  Register,
  Forum,
  Topic,
  Leaderboard,
  Profile,
  Page404,
  Page500,
} from "@/pages";
// import TDEngine from "@/pages/Game/engine/TDEngine";
import { Layout } from "@/layout";
// import { useLayoutStore, useUserStore } from "@/store";
import { getStateForServer } from "@/store/ssr-store";

// create engine instance
// const engine = new TDEngine();

const storen = getStateForServer();
export const MyContext = createContext(storen);
export const appContext = createContext({});

let store: { setState: (arg0: any) => void; getState: () => any };

const useCreateStore = () => {
  if (typeof window === "undefined") {
    return () => getStateForServer();
  }
  store = store ?? getStateForServer();
  return () => store;
};

function withServerSideStore(Component: ComponentType) {
  // @ts-ignore
  return (props) => {
    // @ts-ignore
    const createStore = useCreateStore({ ...props });
    return (
      // @ts-ignore
      <appContext.Provider value={createStore}>
        <Component {...props} />
      </appContext.Provider>
    );
  };
}
export default withServerSideStore(function Home() {
  const [mode, setMode] = React.useState<"dark" | "light">("light");
  // @ts-ignore
  const useUserStore = useContext(MyContext).useUserStore;
  // @ts-ignore
  const useLayoutStore = useContext(MyContext).useLayoutStore;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  // @ts-ignore
  const colorModeFunc = useLayoutStore((stores) => stores.colorModeFunc);
  const colorMode = useLayoutStore((stores) => stores.colorMode);
  // eslint-disable-next-line @typescript-eslint/no-shadow
  // @ts-ignore
  const fetchUser = useUserStore((stores) => stores.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    setMode(colorModeFunc());
  }, [colorModeFunc, colorMode]);

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
        <ErrorBoundary>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
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
                  <Route path={R.profile} element={<Profile />} />
                  <Route path={R.forum} element={<Forum />} />
                  <Route path={R.topic} element={<Topic />} />
                </Route>
              </Route>

              <Route path={R.page500} element={<Page500 />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Box>
          <Snackbar />
        </ErrorBoundary>
      </CSSBaseLine>
    </ThemeProvider>
  );
});

// const App = () => {
//   const store = useContext(MyContext);
//   const mode = store.useLayoutStore.getState().colorMode;
//   const fetchUser = store.useUserStore.getState().fetchUser;
//
//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);
//
//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode,
//         },
//       }),
//     [mode],
//   );
//   return (
//     <ThemeProvider theme={theme}>
//       <CSSBaseLine>
//         <ErrorBoundary>
//           <Router>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 minHeight: "100vh",
//               }}
//             >
//               <Routes>
//                 <Route element={<Layout />}>
//                   <Route element={<ProtectedToAuth />}>
//                     <Route path={R.login} element={<Login />} />
//                     <Route path={R.register} element={<Register />} />
//                   </Route>
//                   <Route path={R.leaderboard} element={<Leaderboard />} />
//                   <Route element={<ProtectedRoutes />}>
//                     <Route path={R.game} element={<Game engine={engine} />} />
//                     <Route path={R.profile} element={<Profile />} />
//                     <Route path={R.forum} element={<Forum />} />
//                     <Route path={R.topic} element={<Topic />} />
//                   </Route>
//                 </Route>
//
//                 <Route path={R.page500} element={<Page500 />} />
//                 <Route path="*" element={<Page404 />} />
//               </Routes>
//             </Box>
//             <Snackbar />
//           </Router>
//         </ErrorBoundary>
//       </CSSBaseLine>
//     </ThemeProvider>
//   );
// };

// export default App;
