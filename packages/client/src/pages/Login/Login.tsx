import { Container, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AuthLogin from "./AuthLogin";

export function Login() {
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
