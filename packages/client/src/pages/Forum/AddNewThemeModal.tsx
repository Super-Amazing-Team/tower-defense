import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newForumThemeSchema as schema } from "@/types";
import { useForumStore, useUserStore } from "@/store";
import { ICreateTopic } from "@/store/forumStore";

type TSchema = z.infer<typeof schema>;
export interface IAddNewThemeModalProps {
  isOpenAddNewThemeModal: boolean;
  onCloseModal: (val: boolean) => void;
}
export const AddNewThemeModal = (props: IAddNewThemeModalProps) => {
  const { id } = useUserStore((store) => store.user);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const createTopic = useForumStore((store) => store.createTopic);

  React.useEffect(() => {
    setIsOpen(props.isOpenAddNewThemeModal);
  }, [props.isOpenAddNewThemeModal]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = (data: TSchema) => {
    const topic: ICreateTopic = {
      title: data.title,
      description: data.description,
      ownerId: id.toString(),
    };
    createTopic(topic);
    handleClose();
  };

  const handleClose = () => {
    props.onCloseModal(true);
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="alert-dialog-title">{"Создать тему"}</DialogTitle>
        <DialogContent>
          <Grid sx={{ padding: "18px" }} container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Тема"
                type="text"
                placeholder="Тема"
                fullWidth
                helperText={errors.title?.message || " "}
                error={Boolean(errors.title)}
                {...register("title")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Описание"
                placeholder="Описание"
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                helperText={errors.description?.message || " "}
                error={Boolean(errors.description)}
                {...register("description")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button
            type="submit"
            autoFocus
            disabled={
              !!errors.title?.message?.length ||
              !!errors.description?.message?.length
            }
          >
            Создать
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
