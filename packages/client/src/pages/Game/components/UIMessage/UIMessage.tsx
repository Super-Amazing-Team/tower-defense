import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import { useGameStore } from "@/store";
import { ColorDict, TDEngine } from "@/pages/Game/engine/TDEngine";

export interface IUiMessage {
  engine: TDEngine;
}
export const UiMessage = ({ engine }: IUiMessage) => {
  const waveType = useGameStore((state) => state.waveType, shallow);
  let waveTypeColor: string = ColorDict.fontColor;
  switch (waveType) {
    case "boss": {
      waveTypeColor = "red";
      break;
    }
    case "fast": {
      waveTypeColor = "green";
      break;
    }
    case "slow": {
      waveTypeColor = "blue";
      break;
    }
    case "strong": {
      waveTypeColor = "white";
      break;
    }
    default: {
      waveTypeColor = ColorDict.fontColor;
      break;
    }
  }
  const isGameOver = useGameStore((state) => state.isGameOver, shallow);
  const countdown = useGameStore((state) => state.countdown, shallow);
  const isGameMenuOpen = useGameStore((state) => state.isGameMenuOpen, shallow);
  const isGameStarted = useGameStore((state) => state.isGameStarted, shallow);

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        zIndex: engine.canvasZIndex.spellDraft,
        width: "100%",
        height: "100%",
        display: "flex",
        userSelect: "none",
        "& p": {
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
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
            Boolean(countdown) && (
              <Typography>
                {`Next wave in ${countdown}`}
                <br />
                <span>
                  Type:
                  <span
                    style={{
                      color: waveTypeColor,
                    }}
                  >{`${waveType}`}</span>
                </span>
              </Typography>
            )
          )}
        </>
      ) : (
        !isGameStarted &&
        !Boolean(countdown) && <Typography>{`Game paused`}</Typography>
      )}
    </Box>
  );
};
