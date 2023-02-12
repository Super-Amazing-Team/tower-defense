import { useParams } from "react-router-dom";
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { IForum, IForumMessage } from "@/pages/Forum/const";
import { useTopicStore } from "@/store/forumStore";
import { TopicMessage } from "@/pages/Topic/TopicMessage";

export function Topic() {
  const params = useParams();
  const forumMock: IForum = useTopicStore((store) => store.topic);

  const [forum, setForum] = React.useState<IForum>();

  React.useEffect(() => {
    // Запрос к апи по id форума
    setForum(forumMock);
  }, [params.id]);

  return (
    <Container
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {forum ? (
        <>
          <Box
            sx={{
              display: "flex",
              borderBottom: "1px solid #dbdbdb",
              pb: 1,
            }}
          >
            <Typography
              sx={{
                flex: 1,
                alignSelf: "center",
              }}
            >
              {forum.title}
            </Typography>
            <Typography
              sx={{
                flex: 2,
              }}
            >
              {forum.description}
            </Typography>
          </Box>
          <Box>
            {forumMock.messages.map((item: IForumMessage) => (
              <TopicMessage
                key={item.date}
                text={item.text}
                user={item.user}
                date={item.date}
              />
            ))}
          </Box>
        </>
      ) : (
        <Typography>Загрузка....</Typography>
      )}
    </Container>
  );
}
