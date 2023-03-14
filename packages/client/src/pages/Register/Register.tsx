import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Link, Typography } from "@mui/material";
import { AuthRegister } from "./AuthRegister";
import { useUserStore } from "@/store/userStore";

export function Register() {
  const user = useUserStore((store) => store.user);
  const navigate = useNavigate();

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
        component={RouterLink}
        to="/"
        color="text.primary"
        sx={{ textAlign: "center", mt: 3, cursor: "pointer" }}
      >
        Вход
      </Link>
    </Container>
  );
}
