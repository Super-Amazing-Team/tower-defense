import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Grid, TextField } from "@mui/material";
import { useProfileStore } from "@/store/profileStore";
import { useUserStore } from "@/store";
import { IUser } from "@/store/userStore";
import { formProfileSchema as schema } from "@/types";

export interface IFormProfileProps {
  user: IUser;
  isEditMode: boolean;
}

type TSchema = z.infer<typeof schema>;

const FormProfile = (props: IFormProfileProps) => {
  const setIsEditMode = useProfileStore((store) => store.updateEditMode);
  const updateUser = useUserStore((store) => store.updateUser);
  const user = useUserStore((store) => store.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSchema>({
    defaultValues: { ...user, display_name: user.display_name ?? "" },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data: TSchema) => {
    setIsEditMode(false);
    updateUser(data);
  };

  const handleEditMode = () => {
    setIsEditMode(false);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Имя"
            type="text"
            disabled={!props.isEditMode}
            placeholder="Имя"
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
            placeholder="Фамилия"
            fullWidth
            disabled={!props.isEditMode}
            helperText={errors.second_name?.message || " "}
            error={Boolean(errors.second_name)}
            {...register("second_name")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Display Name"
            type="text"
            placeholder="Display Name"
            fullWidth
            disabled={!props.isEditMode}
            helperText={errors.display_name?.message || " "}
            error={Boolean(errors.display_name)}
            {...register("display_name")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email address"
            type="email"
            placeholder="Enter email address"
            fullWidth
            disabled={!props.isEditMode}
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
            disabled={!props.isEditMode}
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
            disabled={!props.isEditMode}
            helperText={errors.phone?.message || " "}
            error={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Grid>
        {props.isEditMode && (
          <Grid item xs={12}>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
            >
              Сохранить
            </Button>
            <Button
              disableElevation
              fullWidth
              size="large"
              variant="contained"
              color="secondary"
              onClick={handleEditMode}
            >
              Отмена
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default FormProfile;
