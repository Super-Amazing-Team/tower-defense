import { Avatar, Box, Typography } from "@mui/material";
import { IForumMessage } from "@/pages/Forum/const";

export function TopicMessage(props: IForumMessage) {
  const { date, text, user } = props;

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
        <Avatar alt={user.userName} src={user.avatar} />
        <Typography sx={{ margin: "0 10px" }} component="span">
          {user.userName}
        </Typography>
        <Typography component="span">{date}</Typography>
      </Box>
      <Typography>{text}</Typography>
    </>
  );
}
