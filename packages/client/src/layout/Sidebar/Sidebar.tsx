import type { MouseEvent, KeyboardEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ForumIcon from "@mui/icons-material/Forum";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLayoutStore, useUserStore } from "@/store";
import { TRoutes as R } from "@/types";

const authMenu = [
  { text: "game", icon: <SportsEsportsIcon />, path: R.game },
  { text: "leaderboard", icon: <LeaderboardIcon />, path: R.leaderboard },
  { text: "forum", icon: <ForumIcon />, path: R.forum },
  { text: "profile", icon: <AccountCircleIcon />, path: R.profile },
];

const notAuthMenu = [
  { text: "login", icon: <LoginIcon />, path: R.login },
  { text: "register", icon: <HowToRegIcon />, path: R.register },
  { text: "leaderboard", icon: <LeaderboardIcon />, path: R.leaderboard },
];

export function Sidebar() {
  const isOpenSidebar = useLayoutStore((store) => store.openSidebar);
  const setCloseSidebar = useLayoutStore((store) => store.setCloseSidebar);
  const logout = useUserStore((store) => store.logout);
  const { isAuth } = useUserStore((store) => store.user);
  const closeDrawer = (event: KeyboardEvent | MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" ||
        (event as KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setCloseSidebar();
  };

  return (
    <Drawer open={isOpenSidebar} onClose={closeDrawer}>
      <Toolbar />
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={closeDrawer}
        onKeyDown={closeDrawer}
      >
        <List>
          {(isAuth ? authMenu : notAuthMenu).map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton component={RouterLink} to={path}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {isAuth && (
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Выход"} />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );
}
