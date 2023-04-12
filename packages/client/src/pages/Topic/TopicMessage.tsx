import { Avatar, Box, Typography, Button } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { IMessages, useTopicStore } from "@/store/forumStore";
import { useUserStore } from "@/store";

export function TopicMessage(props: IMessages) {
  const { date, topicId, message, likes, ownerId, dislikes } = props;
  const messageId = props.id;
  const likeMessage = useTopicStore((store) => store.likeMessage);
  const dislikeMessage = useTopicStore((store) => store.dislikeMessage);
  const { id } = useUserStore((store) => store.user);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
        <Avatar alt={ownerId} src={ownerId} />
        <Typography sx={{ margin: "0 10px" }} component="span">
          {ownerId}
        </Typography>
        <Typography component="span">{date}</Typography>
      </Box>
      <Typography>{message}</Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "8px" }}>
        <Button
          sx={{
            mr: "16px",
            opacity: likes.includes(id.toString()) ? "1" : ".5",
          }}
          onClick={() => {
            likeMessage({ id: messageId, userId: id.toString() });
          }}
        >
          {likes.length}
          <ThumbUp sx={{ ml: "16px" }} />
        </Button>
        <Button
          sx={{
            mr: "16px",
            opacity: dislikes.includes(id.toString()) ? "1" : ".5",
          }}
          onClick={() => {
            dislikeMessage({ id: messageId, userId: id.toString() });
          }}
        >
          {dislikes.length}
          <ThumbDown sx={{ ml: "16px" }} />
        </Button>
      </Box>
    </>
  );
}
