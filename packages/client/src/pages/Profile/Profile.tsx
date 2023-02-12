import { useState } from "react";
import type { ChangeEvent } from "react";
import { Avatar, Button, ButtonGroup, Container, Dialog } from "@mui/material";
import { useProfileStore, useUserStore } from "@/store";
import FormProfile from "@/pages/Profile/FormProfile";
import EditPasswordForm from "@/pages/Profile/EditPasswordForm";

export function Profile() {
  const logout = useUserStore((store) => store.logout);
  const user = useUserStore((store) => store.user);
  const isEditModeState = useProfileStore((store) => store.isEditMode);
  const setIsEditMode = useProfileStore((store) => store.updateEditMode);
  const [isOpenEditPasswordModal, setOpenEditPasswordModal] = useState(false);

  const handleOpenModalEditPassword = () => {
    setOpenEditPasswordModal(true);
  };
  const handleCloseEditPasswordModal = () => {
    setOpenEditPasswordModal(false);
  };
  const handleEditMode = () => {
    setIsEditMode(true);
  };

  function onChangeInputFile(event: ChangeEvent<HTMLInputElement>) {
    // eslint-disable-next-line no-console
    console.log(`Saving ${event.target.value}`);
  }

  const logoutMe = () => {
    logout();
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
        src={user.avatar || ""}
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
        open={isOpenEditPasswordModal}
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
