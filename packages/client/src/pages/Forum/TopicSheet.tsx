import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface ITopicProps {
  title: string;
  id: string;
  description: string;
}
export function TopicSheet(props: ITopicProps) {
  const { title, id } = props;

  const navigate = useNavigate();

  function handleItemClick() {
    // Обращение к апи за данными форума
    console.log(title);
    navigate(`/forum/${id}`);
  }

  return (
    <ListItem component="div" disablePadding>
      <ListItemButton onClick={handleItemClick}>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
}
