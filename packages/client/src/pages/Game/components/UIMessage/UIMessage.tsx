import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import { useGameStore } from "@/store";

export interface IUiMessage {}
export const UiMessage = ({}: IUiMessage) => {
  const isGameOver = useGameStore((state) => state.isGameOver, shallow);
  const countdown = useGameStore((state) => state.countdown, shallow);
  const isGameMenuOpen = useGameStore((state) => state.isGameMenuOpen, shallow);

  return (
    <>
      {!isGameMenuOpen && (Boolean(countdown) || isGameOver) && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            zIndex: 50,
            width: "100%",
            height: "100%",
            display: "flex",
            userSelect: "none",
            "& p": {
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              color: "#262626",
              fontSize: "4em",
              width: "100%",
              textAlign: "center",
            },
          }}
        >
          {isGameOver ? (
            <Typography>
              <span>GAME IS OVER!</span>
            </Typography>
          ) : (
            <Typography>
              {Boolean(countdown) && <span>{`Next wave in ${countdown}`}</span>}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};
