import { useState } from "react";
import type { ChangeEvent } from "react";
import { Avatar, Button, ButtonGroup, Container, Dialog } from "@mui/material";
import { useProfileStore, useUserStore } from "@/store";
import { joinUrl } from "@/utils";
import { FormProfile } from "@/pages/Profile/FormProfile";
import { EditPasswordForm } from "@/pages/Profile/EditPasswordForm";
import { baseUrl } from "@/constants";

export function Profile() {
  const [isOpenEditPasswordModal, setOpenEditPasswordModal] = useState(false);
  const logout = useUserStore((store) => store.logout);
  const updateAvatar = useUserStore((store) => store.updateAvatar);
  const user = useUserStore((store) => store.user);
  const isEditModeState = useProfileStore((store) => store.isEditMode);
  const setIsEditMode = useProfileStore((store) => store.updateEditMode);

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
    const { files } = event.target;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("avatar", files[0]);
      updateAvatar(formData);
    }
  }

  const buttons = [
    <Button key="one" onClick={handleEditMode}>
      Редактировать
    </Button>,
    <Button key="two" onClick={handleOpenModalEditPassword}>
      Изменить пароль
    </Button>,
    <Button key="three" onClick={logout}>
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
        src={
          user.avatar ? joinUrl(baseUrl, `/api/v2/resources${user.avatar}`) : ""
        }
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
          name="avatar"
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
