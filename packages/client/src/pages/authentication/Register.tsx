// import { Link } from "react-router-dom";

// material-ui
import { Container, Link, Typography } from '@mui/material'

// project import
import AuthRegister from "./auth-forms/AuthRegister";

// ================================|| REGISTER ||================================ //

const Register = () => (
  <Container
    maxWidth="sm"
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}
  >
      <Typography
        variant="h4"
        mb={5}
        sx={{textAlign: 'center', textTransform: 'uppercase'}}
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

export default Register;
