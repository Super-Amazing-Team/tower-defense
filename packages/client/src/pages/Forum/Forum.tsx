import { Box, Button, Container, List, Typography } from "@mui/material";
import React from "react";
import { useForumStore } from "@/store";
import { IForumInfo } from "@/pages/Forum/const";
import { AddNewThemeModal } from "@/pages/Forum/AddNewThemeModal";
import { TopicSheet } from "@/pages/Forum/TopicSheet";

export function Forum() {
  const fiveForums = useForumStore((store) => store.getFiveForums);
  const allForums = useForumStore((store) => store.getAllForums);
  const [isShowMore, setIsShowMore] = React.useState<boolean>(false);
  const [isShowAddNewThemeModal, setShowAddNewThemeModal] =
    React.useState<boolean>(false);
  const [forums, setForums] = React.useState<IForumInfo[]>([]);

  React.useEffect(() => {
    setForums(fiveForums);
  }, []);

  function handleShowMoreButton() {
    setIsShowMore(true);
    setForums(allForums);
  }
  const handleClickOpenModal = () => {
    setShowAddNewThemeModal(true);
  };

  function handleOnCloseModal() {
    setShowAddNewThemeModal(false);
  }

  return (
    <Container
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{
          borderBottom: "1px solid #dbdbdb",
          padding: "10px",
        }}
      >
        Форум
      </Typography>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box>
          <Button
            onClick={handleClickOpenModal}
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
            Добавить тему
          </Button>
          <Box
            sx={{
              height: "70vh",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            <Typography>Темы</Typography>
            <List
              sx={{
                width: "100%",
                maxHeight: "80%",
                bgcolor: "background.paper",
                overflow: "auto",
              }}
            >
              {forums.map((item: IForumInfo) => (
                <TopicSheet key={item.id} title={item.title} id={item.id} />
              ))}
            </List>
            {!isShowMore && (
              <Button
                component="label"
                size="small"
                variant="text"
                color="primary"
                sx={{
                  height: "28px",
                  m: "20px auto",
                }}
                onClick={handleShowMoreButton}
              >
                Показать ещё
              </Button>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Выберите тему для разговора</Typography>
        </Box>
      </Box>
      <AddNewThemeModal
        isOpenAddNewThemeModal={isShowAddNewThemeModal}
        onCloseModal={handleOnCloseModal}
      />
    </Container>
  );
}
