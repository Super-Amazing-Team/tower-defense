import React, { useState } from "react";
import { Box, MenuItem, MenuList } from "@mui/material";
import { shallow } from "zustand/shallow";
import { useGameStore } from "@/store";
import { TDEngine } from "@/pages/Game/engine/TDEngine";

interface IGameMenu {
  engine: TDEngine;
}
export const GameMenu = ({ engine }: IGameMenu) => {
  const [isGameMenuOpen, setIsGameMenuOpen] = useGameStore(
    (state) => [state.isGameMenuOpen, state.updateIsGameMenuOpen],
    shallow,
  );
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useGameStore(
    (state) => [state.isBuildMenuOpen, state.updateIsBuildMenuOpen],
    shallow,
  );
  const [isGameStarted, setIsGameStarted] = useGameStore(
    (state) => [state.isGameStarted, state.updateIsGameStarted],
    shallow,
  );
  const [isGameOver, setIsGameOver] = useGameStore(
    (state) => [state.isGameOver, state.updateIsGameOver],
    shallow,
  );
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(
    engine.isSoundEnabled,
  );

  return (
    <Box
      className="b-game-menu-wrapper"
      sx={{
        display: isGameMenuOpen ? "flex" : "none",
        position: "absolute",
        zIndex: 100,
        top: 0,
        width: "100%",
        height: "100%",
        background: `url("${engine.map?.grassBackrgroundCanvas?.toDataURL()}") repeat`,
        justifyContent: "center",
      }}
    >
      <Box
        className="b-game-menu"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MenuList
          className="b-game-menu-content"
          sx={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "'Press Start 2P', cursive",
          }}
        >
          <MenuItem
            className="b-game-menu-item"
            onClick={() => {
              if (!isGameStarted) {
                engine.gameStart();
                setIsGameStarted(true);
              }
              setIsGameMenuOpen(false);
              setIsBuildMenuOpen(true);
            }}
            disabled={isGameOver}
          >
            {isGameStarted ? "Resume" : "Start"} game
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (isGameStarted) {
                engine.gameStop();
                setIsGameStarted(false);
              }
              setIsGameMenuOpen(false);
            }}
            disabled={!isGameStarted || isGameOver}
          >
            Pause game
          </MenuItem>
          <MenuItem
            onClick={() => {
              engine.gameRestart();
              setIsGameMenuOpen(false);
              setIsGameStarted(true);
            }}
          >
            Restart game
          </MenuItem>
          <MenuItem
            onClick={() => {
              engine.isSoundEnabled = false;
              if (isSoundEnabled) {
                setIsSoundEnabled(false);
                engine.sound?.soundArr?.gameStart?.pause();
              } else {
                setIsSoundEnabled(true);
                engine.sound?.soundArr?.gameStart?.play();
              }
              setIsGameMenuOpen(false);
            }}
          >
            {isSoundEnabled ? "Disable" : "Enable"} music
          </MenuItem>
        </MenuList>
      </Box>
    </Box>
  );
};
