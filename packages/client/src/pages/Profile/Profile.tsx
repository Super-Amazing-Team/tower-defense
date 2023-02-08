import { useNavigate } from "react-router-dom";
import { Avatar, Button, ButtonGroup, Container, Dialog } from "@mui/material";
import React from "react";
import { useProfileStore, useUserStore } from "@/store";
import FormProfile from "@/pages/Profile/FormProfile";
import EditPasswordForm from "@/pages/Profile/EditPasswordForm";

export function Profile() {
  const navigate = useNavigate();
  const logout = useUserStore((store) => store.logout);
  const user = useProfileStore((store) => store.user);
  const isEditModeState = useProfileStore((store) => store.isEditMode);
  const setIsEditMode = useProfileStore((store) => store.updateEditMode);
  const [openEditPasswordModal, setOpenEditPasswordModal] =
    React.useState(false);

  const handleOpenModalEditPassword = () => {
    setOpenEditPasswordModal(true);
  };
  const handleCloseEditPasswordModal = () => {
    setOpenEditPasswordModal(false);
  };
  const handleEditMode = () => {
    setIsEditMode(true);
  };

  function handleCloseModalEditAvatar() {
    console.log("handleCloseModalEditAvatar");
  }

  function onChangeInputFile(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Saving ${event.target.value}`);
  }

  const logoutMe = (e: { preventDefault: () => void }) => {
    logout();
    navigate("/");
  };

  const buttons = [
    <Button key="one" onClick={handleEditMode}>
      Редактировать
    </Button>,
    <Button key="two" onClick={handleOpenModalEditPassword}>
      Изменить пароль
    </Button>,
    <Button key="three" onClick={logoutMe}>
      Выход
    </Button>,
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
        component="label"
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
        <input
          onChange={onChangeInputFile}
          hidden
          accept="image/*"
          multiple
          type="file"
        />
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
        open={openEditPasswordModal}
        onClose={handleCloseEditPasswordModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <EditPasswordForm
          onCloseModalEditPassword={handleCloseEditPasswordModal}
        />
      </Dialog>
    </Container>
  );
}
