import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Grid, TextField } from "@mui/material";
import { IProfileUser, useProfileStore } from "@/store/profileStore";

export interface IFormProfileProps {
  user: IProfileUser;
  isEditMode: boolean;
}

const schema = z.object({
  first_name: z.string().min(3).max(20),
  second_name: z.string().min(3).max(20),
  email: z.string().email(),
  login: z.string().min(3).max(20),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/),
});

type TSchema = z.infer<typeof schema>;

const FormProfile = (props: IFormProfileProps) => {
  const setIsEditMode = useProfileStore((store) => store.updateEditMode);
  const user = useProfileStore((store) => store.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data: TSchema) => {
    setIsEditMode(false);
    console.log(data);
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
            defaultValue={user.first_name}
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
            defaultValue={user.second_name}
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
            label="Email address"
            type="email"
            defaultValue={user.email}
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
            defaultValue={user.login}
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
            defaultValue={user.phone}
            fullWidth
            disabled={!props.isEditMode}
            helperText={errors.phone?.message || " "}
            error={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Grid>
        {props.isEditMode && (
          <Grid
            item
            xs={12}
            sx={{
              height: 112,
            }}
          >
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              Сохранить
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default FormProfile;
