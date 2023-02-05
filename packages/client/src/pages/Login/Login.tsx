import { Container, Typography, Link } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import AuthLogin from "./AuthLogin";

export function Login() {
  const user = useUserStore((store) => store.user);
  const login = useUserStore((store) => store.login);

  const loginMe = (e: any): void => {
    e.preventDefault();
    const form = e.target;
    const userInputField = [...form.elements.userInput];

    login(userInputField[0].value, userInputField[1].value, true);

    window.location.href = "/profile";
  };

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
