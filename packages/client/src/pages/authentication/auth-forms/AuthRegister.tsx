import React, { MouseEvent, useState } from "react";

// material-ui
import {
  Button, FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField
} from '@mui/material'

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <form noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Имя"
              type="text"
              name="first_name"
              placeholder="Вася"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Фамилия"
              type="text"
              name="second_name"
              placeholder="Иванов"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email address"
              type="email"
              name="email"
              placeholder="Enter email address"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Логин"
              type="text"
              name="login"
              placeholder="Enter login"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Логин"
              type="text"
              name="login"
              placeholder="Enter login"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Телефон"
              type="tel"
              name="phone"
              placeholder="Enter phone"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              Создать аккаунт
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AuthRegister;
