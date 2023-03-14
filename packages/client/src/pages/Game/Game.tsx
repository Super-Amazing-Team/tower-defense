import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import TDEngine from "./engine/TDEngine";
import GameUi from "@/pages/Game/components/GameUI/GameUI";

export interface IGameProps extends PropsWithChildren {
  engine?: TDEngine;
}

export const Game: FC<IGameProps> = ({ engine = new TDEngine() }) => {
  // game window ref
  const gameWindow = useRef<HTMLDivElement>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!engine.isInitialized);

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
      if (engine.isGameStarted) {
        engine.gameLoop();
        engine.gameLoopLogic();
        // add event listeners
        engine.addEventListeners();
      } else {
        engine.stopGame();
        // remove event listeners
        engine.removeEventListeners();
      }
    }

    // componentWillUnmount
    return () => {
      if (engine.isInitialized) {
        if (engine.isGameStarted) {
          // pause teh game
          engine.stopGame();
        }
        // remove event listeners
        engine.removeEventListeners();
      }
    };
  }, [isGameStarted]);

  return (
    <Box
      sx={{
        position: "relative",
        width: `${engine.map?.mapParams?.width}px`,
        height: `${engine.map?.mapParams?.height}px`,
      }}
    >
      <Box
        sx={{ position: "absolute" }}
        className="b-game-window"
        id="gameWindow"
        ref={gameWindow}
      />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <GameUi
          engine={engine}
          isGameStarted={isGameStarted}
          setIsGameStarted={setIsGameStarted}
        />
      )}
    </Box>
  );
};
