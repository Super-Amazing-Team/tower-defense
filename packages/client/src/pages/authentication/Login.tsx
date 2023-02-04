// import { Link as RouterLink } from "react-router-dom";

// material-ui
import { Container, Typography, Link } from '@mui/material'

// project import
import AuthLogin from "./auth-forms/AuthLogin";

// ==============================|| LOGIN ||============================== //

const Login = () => (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h4" mb={5} sx={{textTransform: 'uppercase'}}>
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

export default Login;
