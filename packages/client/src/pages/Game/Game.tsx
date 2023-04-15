import { useEffect, useRef, useState } from "react";
import { CircularProgress, Box, createTheme, Grid } from "@mui/material";
import { shallow } from "zustand/shallow";
import { ThemeProvider } from "@mui/material/styles";
import { ColorDict, TDEngine } from "./engine/TDEngine";
import cursorPointer from "@/../public/UI/cursorPointer.png";
import { GameUi } from "@/pages/Game/components/GameUI/GameUI";
import { useGameStore } from "@/store";
import { SideMenu } from "@/pages/Game/components/SideMenu/SideMenu";
import { BuildMenu } from "@/pages/Game/components/BuildMenu/BuildMenu";
import { GameMenu } from "@/pages/Game/components/GameMenu/GameMenu";
import { UiMessage } from "@/pages/Game/components/UIMessage/UIMessage";

// mui theme
const theme = createTheme({
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: ColorDict.sandColor,
          fontFamily: "'Press Start 2P', cursive",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: ColorDict.fontColor,
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "0.7em",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: ColorDict.fontColor,
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "0.75em",
        },
      },
    },
  },
});

export interface IGameProps {
  engine?: TDEngine;
}

export const Game = ({ engine = new TDEngine() }: IGameProps) => {
  // game window ref
  const gameWindow = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!engine.isInitialized);
  const [isGameStarted, setIsGameStarted] = useGameStore(
    (state) => [state.isGameStarted, state.updateIsGameStarted],
    shallow,
  );

  useEffect(() => {
    // engine init
    if (!engine.isInitialized) {
      engine
        .init(gameWindow.current!)
        .then(() => {
          engine.map?.drawMap();
          engine.map?.drawMapDecorations();

          // add hotkey listeners
          engine.addDocumentEventListeners();

          // set engine init flag to true
          engine.isInitialized = true;
          setIsLoading(false);

          // debug
          console.log(`engine`);
          console.log(engine);
          //
        })
        .catch((error) => {
          throw new Error(
            `Can't initialize teh engine, reason: ${error.reason ?? error}`,
          );
        });
    }
  }, []);

  useEffect(() => {
    if (engine.isInitialized) {
      // game start
      if (isGameStarted) {
        engine.gameStart();
      } else {
        engine.gameStop();
      }
    }
    if (engine?.waveGenerator?.isInitialized) {
      // add hotkey listeners
      engine.addDocumentEventListeners();
    }

    // componentWillUnmount
    return () => {
      if (engine.isInitialized) {
        if (isGameStarted) {
          // pause teh game
          engine.gameStop();
        }
        // remove event listeners
        // engine.removeDocumentEventListeners();
        // set engine init flag to false
        // engine.isInitialized = false;
        // engine.isCanvasCreated = false;
      }
    };
  }, [isGameStarted]);

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          cursor: `url("${cursorPointer}"), auto`,
          position: "relative",
          "& .b-game-window": {
            position: "absolute",
            display: !isLoading ? "flex" : "none",
          },
          background: `url("${
            !isLoading ? engine.map?.grassBackrgroundCanvas?.toDataURL() : 0
          }") 0 0 repeat`,
        }}
      >
        {!isLoading && <GameUi engine={engine} />}
        <Box className="b-game-window" id="gameWindow" ref={gameWindow} />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              position: "relative",
              width: `${engine.map?.mapParams?.width}px`,
              height: `${engine.map?.mapParams?.height}px`,
              overflow: "hidden",
            }}
          >
            <SideMenu engine={engine} />
            <BuildMenu engine={engine} />
            <GameMenu engine={engine} />
            <UiMessage engine={engine} />
          </Box>
        )}
      </Grid>
    </ThemeProvider>
  );
};
