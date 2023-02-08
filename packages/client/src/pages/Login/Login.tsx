// import { FormEvent } from "react";
import { Container, Typography, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLogin from "./AuthLogin";
import { useUserStore } from "@/store";

export function Login() {
  const user = useUserStore((store) => store.user);
  const login = useUserStore((store) => store.login);
  const navigate = useNavigate();

  // const loginMe = (e: FormEvent<HTMLFormElement>) => {
  //   const loginInput: HTMLInputElement = document.getElementById("login");
  //   const passwordInput: HTMLInputElement =
  //     document.getElementById("password");

  //   try {
  //     login(loginInput!.value, passwordInput!.value, true);
  //     navigate("/profile");
  //   } catch (err) {
  //     throw new Error(
  //     `Woops, something is broken! Can't log in a user with username ${loginInput!.value}!`,
  //     );
  //   }
  // };

  if (user.isAuth) {
    navigate("/profile");
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
      <Typography variant="h4" mb={5} sx={{ textTransform: "uppercase" }}>
        вход
      </Typography>
      <AuthLogin />
      <Link
        variant="body1"
        component={RouterLink}
        to="/register"
        color="text.primary"
        sx={{ textAlign: "center", mt: 3, cursor: "pointer" }}
      >
        Регистрация
      </Link>
    </Container>
  );
}
