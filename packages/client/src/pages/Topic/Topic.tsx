import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import {
  Box,
  Button,
  Container,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ICreateMessage, IMessages, useTopicStore } from "@/store/forumStore";
import { TopicMessage } from "@/pages/Topic/TopicMessage";
import { newForumMsgSchema as schema } from "@/types";
import { useUserStore } from "@/store";
type TSchema = z.infer<typeof schema>;

export function Topic() {
  const params = useParams();
  const navigate = useNavigate();
  const getTopicById = useTopicStore((store) => store.getTopicById);
  const topic = useTopicStore((store) => store.topic);
  const messages = useTopicStore((store) => store.messages);
  const createMesage = useTopicStore((store) => store.createMessage);
  const { id } = useUserStore((store) => store.user);
  const [countPagination, setCountPagination] = React.useState(0);
  const [topicId, setTopicId] = React.useState("");

  React.useEffect(() => {
    // Запрос к апи по id форума
    if (params.id) {
      getTopicById(params.id);
      setTopicId(params.id);
    }
  }, [params.id]);

  React.useEffect(() => {
    const countMessage: number = topic.messages?.length || 1;
    const count: number = Math.ceil(countMessage / 10);
    setCountPagination(count);
  }, [topic]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  function handleOnBack() {
    navigate("/forum");
  }

  const onSubmit = (data: TSchema) => {
    const message: ICreateMessage = {
      ownerId: id.toString(),
      topicId: topicId,
      message: data.message,
    };
    createMesage(message);
  };

  function handleChangePagination(
    event: React.ChangeEvent<unknown>,
    page: number,
  ) {
    // запрос к апи за определенной странице
    console.log(event, page);
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {topic ? (
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
              {topic.title}
            </Typography>
            <Typography
              sx={{
                flex: 2,
              }}
            >
              {topic.description}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, maxHeight: "60vh" }} overflow={"auto"}>
            {messages?.map((item: IMessages) => (
              <TopicMessage
                key={item.id}
                message={item.message}
                ownerId={item.ownerId}
                date={item.date}
                likes={item.likes}
                dislikes={item.dislikes}
                id={item.id}
                topicId={item.topicId}
              />
            ))}
          </Box>
          <Box
            sx={{
              marginTop: "20px",
              borderTop: "1px solid #dbdbdb",
              paddingTop: "10px",
            }}
          >
            <TextField
              label="Сообщение"
              placeholder="Сообщение"
              fullWidth
              multiline
              minRows={1}
              maxRows={3}
              helperText={errors.message?.message || " "}
              error={Boolean(errors.message)}
              {...register("message")}
            />
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              sx={{ marginRight: "auto", marginBottom: "10px" }}
              disabled={!!errors.message?.message?.length}
            >
              Отправить
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              borderTop: "1px solid #dbdbdb",
              pt: 1,
            }}
          >
            <Button
              sx={{
                height: "26px",
                width: "60px",
              }}
              variant="contained"
              onClick={handleOnBack}
            >
              Назад
            </Button>
            <Pagination
              sx={{
                alignItems: "center",
                marginLeft: "calc((100%)/2 - 60px)",
              }}
              onChange={handleChangePagination}
              count={countPagination}
            />
          </Box>
        </>
      ) : (
        <Typography>Загрузка....</Typography>
      )}
    </Container>
  );
}
