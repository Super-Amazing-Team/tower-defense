import type { MouseEvent, KeyboardEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Drawer,
} from "@mui/material";
import {
  Login as LoginIcon,
  HowToReg as HowToRegIcon,
  Home as HomeIcon,
  Leaderboard as LeaderboardIcon,
  SportsEsports as SportsEsportsIcon,
  Forum as ForumIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { TRoutes as R } from "@/types";
import { useLayoutStore, useUserStore } from "@/store";

const authMenu = [
  { text: "home", icon: <HomeIcon />, path: R.home },
  { text: "game", icon: <SportsEsportsIcon />, path: R.game },
  { text: "leaderboard", icon: <LeaderboardIcon />, path: R.leaderboard },
  { text: "forum", icon: <ForumIcon />, path: R.forum },
  { text: "profile", icon: <AccountCircleIcon />, path: R.profile },
];

const notAuthMenu = [
  { text: "home", icon: <HomeIcon />, path: R.home },
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

