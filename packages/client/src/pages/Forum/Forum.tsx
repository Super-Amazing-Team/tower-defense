import { Box, Button, Container, List, Typography } from "@mui/material";
import { useForumStore } from "@/store";
import { IForum } from "@/pages/Forum/const";
import { Topic } from "@/pages/Topic";

export function Forum() {
  const forums = useForumStore((store) => store.forums);
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
          <Box>
            <Typography>Темы</Typography>
            <List
              sx={{
                width: "100%",
                height: "80vh",
                maxWidth: 360,
                bgcolor: "background.paper",
                overflow: "auto",
              }}
            >
              {forums.data.map((item: IForum) => (
                <Topic key={item.id} title={item.title} id={item.id} />
              ))}
            </List>
          </Box>
        </Box>
        <Box>
          <Typography>Выберите тему для разговора</Typography>
        </Box>
      </Box>
    </Container>
  );
}
