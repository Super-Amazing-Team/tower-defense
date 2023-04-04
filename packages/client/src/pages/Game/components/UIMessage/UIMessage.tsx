import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import { useGameStore } from "@/store";
import { TDEngine } from "@/pages/Game/engine/TDEngine";

export interface IUiMessage {
  engine: TDEngine;
}
export const UiMessage = ({ engine }: IUiMessage) => {
  const isGameOver = useGameStore((state) => state.isGameOver, shallow);
  const countdown = useGameStore((state) => state.countdown, shallow);
  const isGameMenuOpen = useGameStore((state) => state.isGameMenuOpen, shallow);
  const isGameStarted = useGameStore((state) => state.isGameStarted, shallow);

  return (
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
          justifyContent: "center",
          color: "#262626",
          fontSize: "4em",
          width: "100%",
          textAlign: "center",
        },
      }}
    >
      {!isGameMenuOpen && (Boolean(countdown) || isGameOver) ? (
        <>
          {isGameOver ? (
            <Typography>GAME IS OVER!</Typography>
          ) : (
            <Typography>
              {Boolean(countdown) && `Next wave in ${countdown}`}
            </Typography>
          )}
        </>
      ) : (
        !isGameStarted &&
        !Boolean(countdown) && <Typography>{`Game paused`}</Typography>
      )}
    </Box>
  );
};
