import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { MouseEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useUserStore } from "@/store";

const schema = z.object({
  first_name: z.string().min(3).max(20),
  second_name: z.string().min(3).max(20),
  email: z.string().email(),
  login: z.string().min(3).max(20),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/),
  password: z.string().min(6).max(20),
});

type TSchema = z.infer<typeof schema>;

const AuthRegister = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const signUp = useUserStore((store) => store.signUp);
  const handleClickShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data: TSchema) => {
    signUp(data);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Имя"
            type="text"
            placeholder="Вася"
            fullWidth
            helperText={errors.first_name?.message || " "}
            error={Boolean(errors.first_name)}
            {...register("first_name")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Фамилия"
            type="text"
            placeholder="Иванов"
            fullWidth
            helperText={errors.second_name?.message || " "}
            error={Boolean(errors.second_name)}
            {...register("second_name")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email address"
            type="email"
            placeholder="Enter email address"
            fullWidth
            helperText={errors.email?.message || " "}
            error={Boolean(errors.email)}
            {...register("email")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Логин"
            type="text"
            placeholder="Enter login"
            fullWidth
            helperText={errors.login?.message || " "}
            error={Boolean(errors.login)}
            {...register("login")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Телефон"
            type="tel"
            placeholder="Enter phone"
            fullWidth
            helperText={errors.phone?.message || " "}
            error={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-password"
              error={Boolean(errors.password)}
            >
              Пароль
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={isShowPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              error={Boolean(errors.password)}
              {...register("password")}
            />
            <FormHelperText error>
              {errors.password?.message || " "}
            </FormHelperText>
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
  );
};

export default AuthRegister;
