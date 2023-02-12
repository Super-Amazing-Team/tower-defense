import { Avatar, Box, Typography } from "@mui/material";
import { IForumMessage, IUser } from "@/pages/Forum/const";

export function TopicMessage(props: IForumMessage) {
  const { date, text, user } = props;

  return (
    <>
      <Box>
        <Avatar alt={user.userName} src={user.avatar} />
        <Typography component="span">{user.userName}</Typography>
        <Typography component="span">{date}</Typography>
      </Box>
      <Typography>{text}</Typography>
    </>
  );
}
