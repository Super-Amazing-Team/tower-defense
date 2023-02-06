import {
  Avatar,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogActions,
} from "@mui/material";
import React from "react";
import FormProfile from "@/pages/Profile/FormProfile";
import { useProfileStore } from "@/store";
import EditPasswordModal from "@/pages/Profile/EditPasswordModal";

export function Profile() {
  const user = useProfileStore((store) => store.user);
  const isEditModeState = useProfileStore((store) => store.isEditMode);
  const setIsEditMode = useProfileStore((store) => store.updateEditMode);
  const [open, setOpen] = React.useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const buttons = [
    <Button key="one" onClick={handleEditMode}>
      Редактировать
    </Button>,
    <Button key="two" onClick={handleOpenModal}>
      Изменить пароль
    </Button>,
    <Button key="three">Выход</Button>,
  ];

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
      <Avatar
        alt={user.login}
        src={user.avatar}
        sx={{ width: 64, height: 64, m: "0 auto" }}
      />
      <Button
        size="small"
        variant="contained"
        color="primary"
        sx={{
          width: "180px",
          height: "28px",
          m: "20px auto",
        }}
      >
        ЗАГРУЗИТЬ ФОТО
      </Button>
      <FormProfile isEditMode={isEditModeState} user={user} />

      {!isEditModeState && (
        <ButtonGroup
          sx={{
            width: 164,
            m: "0 auto",
          }}
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="text"
        >
          {buttons}
        </ButtonGroup>
      )}

      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <EditPasswordModal />
        <DialogActions>
          <Button onClick={handleCloseModal}>Disagree</Button>
          <Button onClick={handleCloseModal} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
