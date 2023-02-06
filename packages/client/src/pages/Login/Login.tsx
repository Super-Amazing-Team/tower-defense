import { Container, Typography, Link } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
// import { FormEvent } from "react";
import AuthLogin from "./AuthLogin";
import { useUserStore } from "@/store/userStore";

export function Login() {
  const user = useUserStore((store) => store.user);
  const login = useUserStore((store) => store.login);
  const navigate = useNavigate();

  // const loginMe = (e: FormEvent<HTMLFormElement>) => {
  //   const loginInput = document.querySelector<HTMLInputElement>("input#login");
  //   const passwordInput =
  //     document.querySelector<HTMLInputElement>("input#password");

  //   try {
  //     login(loginInput!.value, passwordInput!.value, true);
  //     navigate("/profile");
  //   } catch (err) {
  //     throw new Error(
  //     `Woops, something is broken! Can't login a user with username ${loginInput!.value}!`,
  //     );
  //   }
  // };

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
      <Typography variant="h4" mb={5} sx={{ textTransform: "uppercase" }}>
        вход
      </Typography>
      <AuthLogin />
      <Link
        variant="body1"
        // component={RouterLink}
        // to=""
        color="text.primary"
        sx={{ textAlign: "center", mt: 3, cursor: "pointer" }}
      >
        Регистрация
      </Link>
    </Container>
  );
}
