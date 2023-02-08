import type { MouseEvent } from "react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormControl,
  FormHelperText,
  Typography,
  Button,
  DialogActions,
} from "@mui/material";
import { z } from "zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const schema = z
  .object({
    oldPassword: z.string().min(6).max(20),
    newPassword: z.string().min(6).max(20),
    confirmNewPassword: z.string().min(6).max(20),
  })
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Пароли не совпадают",
        path: ["confirmNewPassword"],
      });
    }
  });

type TSchema = z.infer<typeof schema>;

export interface IEditPasswordFormProps {
  onCloseModalEditPassword: () => void;
}

const EditPasswordForm = (props: IEditPasswordFormProps) => {
  const [isShowOldPassword, setIsShowOldPassword] = useState<boolean>(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] =
    useState<boolean>(false);
  const handleClickShowOldPassword = () => {
    setIsShowOldPassword((prevProps) => !prevProps);
  };
  const handleMouseDownOldPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => {
    setIsShowNewPassword((prevProps) => !prevProps);
  };
  const handleMouseDownNewPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setIsShowConfirmPassword((prevProps) => !prevProps);
  };
  const handleMouseDownConfirmPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  const handleCloseEditPasswordModal = () => {
    props.onCloseModalEditPassword();
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
    console.log(data);
    handleCloseEditPasswordModal();
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Typography ml={1} mt={1}>
        Сменить пароль
      </Typography>
      <Grid sx={{ padding: "18px" }} container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-old-password"
              error={Boolean(errors.oldPassword)}
            >
              Old Password
            </InputLabel>
            <OutlinedInput
              autoComplete="current-password"
              id="outlined-adornment-old-password"
              type={isShowOldPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowOldPassword}
                    onMouseDown={handleMouseDownOldPassword}
                    edge="end"
                  >
                    {isShowOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Old password"
              error={Boolean(errors.oldPassword)}
              {...register("oldPassword")}
            />
            <FormHelperText error>
              {errors.oldPassword?.message || " "}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-new-password"
              error={Boolean(errors.newPassword)}
            >
              New Password
            </InputLabel>
            <OutlinedInput
              autoComplete="new-password"
              id="outlined-adornment-new-password"
              type={isShowNewPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownNewPassword}
                    edge="end"
                  >
                    {isShowNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              error={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            <FormHelperText error>
              {errors.newPassword?.message || " "}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-confirm-password"
              error={Boolean(errors.confirmNewPassword)}
            >
              New Password
            </InputLabel>
            <OutlinedInput
              autoComplete="new-password"
              id="outlined-adornment-confirm-password"
              type={isShowConfirmPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    edge="end"
                  >
                    {isShowConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              error={Boolean(errors.confirmNewPassword)}
              {...register("confirmNewPassword")}
            />
            <FormHelperText error>
              {errors.confirmNewPassword?.message || " "}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={handleCloseEditPasswordModal} autoFocus>
          Закрыть
        </Button>
        <Button type="submit">Изменить</Button>
      </DialogActions>
    </form>
  );
};

export default EditPasswordForm;
