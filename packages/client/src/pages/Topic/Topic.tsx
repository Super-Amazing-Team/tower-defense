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
import { IForum, IForumMessage } from "@/pages/Forum/const";
import { useTopicStore } from "@/store/forumStore";
import { TopicMessage } from "@/pages/Topic/TopicMessage";

const schema = z.object({
  message: z.string().min(3).max(300),
});

type TSchema = z.infer<typeof schema>;

export function Topic() {
  const params = useParams();
  const navigate = useNavigate();
  const forumMock: IForum = useTopicStore((store) => store.topic);

  const [forum, setForum] = React.useState<IForum>();
  const [countPagination, setCountPagination] = React.useState(0);

  React.useEffect(() => {
    // Запрос к апи по id форума
    setForum(forumMock);
  }, [params.id]);

  React.useEffect(() => {
    const countMessage: number = forumMock.messages.length;
    const count: number = Math.ceil(countMessage / 10);
    setCountPagination(count);
  }, [forumMock.messages]);

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
    console.log(data);
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
          <Box sx={{ flex: 1, maxHeight: "60vh" }} overflow={"auto"}>
            {forumMock.messages.map((item: IForumMessage) => (
              <TopicMessage
                key={item.date}
                text={item.text}
                user={item.user}
                date={item.date}
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
