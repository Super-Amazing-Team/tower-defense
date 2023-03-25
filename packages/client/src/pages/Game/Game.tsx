import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { CircularProgress, Box, Typography, createTheme } from "@mui/material";
import { shallow } from "zustand/shallow";
import { ThemeProvider } from "@mui/material/styles";
import sidePanelBg from "../../../public/UI/sidePanelBg.png";
import { TDEngine, TTowerTypes } from "./engine/TDEngine";
import GameUi from "@/pages/Game/components/GameUI/GameUI";
import { useGameStore } from "@/store";
import { BuildMenuTower } from "@/pages/Game/components/BuildMenuTower/BuildMenuTower";

// mui theme
const theme = createTheme({
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#ffae70",
          fontFamily: "'Press Start 2P', cursive",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#000000",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "0.75em",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#000000",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "0.75em",
        },
      },
    },
  },
});

export interface IGameProps extends PropsWithChildren {
  engine?: TDEngine;
}

export const Game: FC<IGameProps> = ({ engine = new TDEngine() }) => {
  // game window ref
  const gameWindow = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!engine.isInitialized);
  const [isGameStarted, setIsGameStarted] = useGameStore(
    (state) => [state.isGameStarted, state.updateIsGameStarted],
    shallow,
  );
  const [isGameMenuOpen, setIsGameMenuOpen] = useGameStore(
    (state) => [state.isGameMenuOpen, state.updateIsGameMenuOpen],
    shallow,
  );
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useGameStore(
    (state) => [state.isBuildMenuOpen, state.updateIsBuildMenuOpen],
    shallow,
  );

  useEffect(() => {
    // engine init
    if (!engine.isInitialized) {
      engine
        .init(gameWindow.current!)
        .then(() => {
          engine.map?.drawMap();
          engine.map?.randomizeBackgroundTiles();
          // set engine init flag to true
          engine.isInitialized = true;
          setIsLoading(false);

          // add hotkey listeners
          engine.addDocumentEventListeners();

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
    // componentWillUnmount
    return () => {
      if (engine.isInitialized) {
        if (isGameStarted) {
          // pause teh game
          engine.gameStop();
        }
        // remove event listeners
        // engine.removeDocumentEventListeners();
      }
    };
  }, [isGameStarted]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "relative",
          width: `${engine.map?.mapParams?.width}px`,
          height: `${engine.map?.mapParams?.height}px`,
          "& .b-game-window": {
            position: "absolute",
            display: !isLoading ? "flex" : "none",
          },
        }}
      >
        <Box className="b-game-window" id="gameWindow" ref={gameWindow} />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <GameUi engine={engine} />
            {isGameStarted && (
              <Box
                sx={{
                  display: isBuildMenuOpen && !isGameMenuOpen ? "flex" : "none",
                  zIndex: isBuildMenuOpen && !isGameMenuOpen ? 100 : 50,
                  position: "absolute",
                  bottom: "0px",
                  width: "100%",
                  height: `${engine.map?.tileToNumber(4)}px`,
                  background: `url(${sidePanelBg}) repeat`,
                  borderTop: "3px solid #bd6a62",
                }}
                className="b-tower-build-menu-wrapper"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                    fontFamily: "'Press Start 2P', cursive",
                  }}
                  className="b-tower-build-menu-item"
                >
                  {Object.entries(engine.predefinedTowerParams).map(
                    (tower, index) => {
                      const towerType: TTowerTypes = tower[0] as TTowerTypes;
                      return (
                        <BuildMenuTower
                          key={`build-menu-tower-tower-${towerType}`}
                          tower={tower[1]}
                          towerType={towerType}
                          towerCanvas={
                            engine.towerSprites[towerType]!.canvasArr
                          }
                          onClick={() => {
                            setIsBuildMenuOpen(false);
                            engine.buildTower(towerType, 0);
                          }}
                        />
                      );
                    },
                  )}
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    zIndex: 101,
                    "& > p": {
                      cursor: "pointer",
                      width: "32px",
                      height: "32px",
                      textAlign: "center",
                      fontSize: "1.5em",
                      color: "#bd6a62",
                    },
                  }}
                >
                  <Typography
                    onClick={() => {
                      // toggle build menu
                      setIsBuildMenuOpen(!isBuildMenuOpen);
                    }}
                  >
                    X
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};
