import { Avatar, Box, Typography } from "@mui/material";
import { IMessages } from "@/store/forumStore";

export function TopicMessage(props: IMessages) {
  const { date, topicId, message, likes, ownerId, dislikes } = props;

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
    </>
  );
}
