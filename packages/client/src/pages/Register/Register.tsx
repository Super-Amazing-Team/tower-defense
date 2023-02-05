import { Navigate } from "react-router-dom";
import { Container, Link, Typography } from "@mui/material";
import { useUserStore } from "@/store/userStore";
import AuthRegister from "./AuthRegister";

export function Register() {
  const user = useUserStore((store) => store.user);

  if (user.isAuth) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        mb={5}
        sx={{ textAlign: "center", textTransform: "uppercase" }}
      >
        регистрация
      </Typography>
      <AuthRegister />
      <Link
        variant="body1"
        // component={RouterLink}
        // to=""
        color="text.primary"
        sx={{ textAlign: "center", mt: 3, cursor: "pointer" }}
      >
        Вход
      </Link>
    </Container>
  );
}
