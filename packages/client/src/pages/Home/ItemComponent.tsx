import { Box, Typography } from "@mui/material";

interface IItemComponent {
  image: string;
  text: string;
  smallImage: boolean;
}

export function ItemComponent({ image, text, smallImage }: IItemComponent) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "0 0 60px",
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          minWidth: "64px",
          height: smallImage ? "64px" : "128px",
          marginTop: smallImage ? "32px" : 0,
        }}
      />
      <Typography
        variant="h5"
        sx={{
          margin: "26px 0 0 60px",
          color: "#104603",
          textAlign: "left",
          fontFamily: "'Press Start 2P', cursive",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
