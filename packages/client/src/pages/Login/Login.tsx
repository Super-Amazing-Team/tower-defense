import { Container, Typography, Link, Button } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { AuthLogin } from "./AuthLogin";
import { OAUTH_URI, REDIRECT_URI } from "@/constants";
import { ApiClient } from "@/api";
import { useUserStore } from "@/store";

export function Login() {
  const oauthLogin = useUserStore((store) => store.oauthLogin);
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      oauthLogin({
        code: String(code),
        redirect_uri: REDIRECT_URI,
      });
    }
  }, [params, oauthLogin]);

  const handleLogin = async () => {
    const response = await ApiClient.getYandexServiceId(REDIRECT_URI);
    if (response.status !== 200) {
      return;
    }
    window.location.replace(
      `${OAUTH_URI}&client_id=${response.data.service_id}&redirect_uri=${REDIRECT_URI}`,
    );
  };

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
      <Button onClick={handleLogin}>Войти c помощью Яндекс</Button>
    </Container>
  );
}
