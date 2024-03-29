import { Box, Button, Container, List, Typography } from "@mui/material";
import React from "react";
import { useForumStore } from "@/store";
import { AddNewThemeModal } from "@/pages/Forum/AddNewThemeModal";
import { TopicSheet } from "@/pages/Forum/TopicSheet";
import { ITopic } from "@/api/ApiClient/types";

export function Forum() {
  const allForums = useForumStore((store) => store.allTopics);
  const getAllTopics = useForumStore((store) => store.allForums);
  const [isShowMore, setIsShowMore] = React.useState<boolean>(false);
  const [isShowAddNewThemeModal, setShowAddNewThemeModal] =
    React.useState<boolean>(false);
  const [forums, setForums] = React.useState<ITopic[]>([]);

  React.useEffect(() => {
    getAllTopics();
  }, [getAllTopics]);

  React.useEffect(() => {
    setForums(allForums.slice(0, 4));
  }, [allForums]);

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
              {forums.map((item: ITopic) => (
                <TopicSheet
                  key={item.id}
                  title={item.title}
                  id={item.id}
                  description={item.description}
                />
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
