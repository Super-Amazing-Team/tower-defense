import { Container, Typography, Link } from "@mui/material";
import AuthLogin from "./AuthLogin";

export const Login = () => (
  <Container
    maxWidth="sm"
    sx={{
      minHeight: "100vh",
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
