import React, { useState } from "react";
import { Box, MenuList, MenuItem, Typography, Button } from "@mui/material";
import { shallow } from "zustand/shallow";
import gameUIIcons from "../../../../../public/UI/gameUIIcons.png";
import sidePanelBg from "@/../public/UI/sidePanelBg.png";
import { TDEngine, IWaveGenerator } from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";
import { SideMenu } from "@/pages/Game/components/SideMenu/SideMenu";

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface IGameUI {
  engine: TDEngine;
  lives?: number;
  score?: number;
  money?: number;
  wave?: IWaveGenerator["waveParams"]["currentWave"];
  waveCountdown?: IWaveGenerator["waveCountdown"];
  isEnoughMoney?: boolean;
}

const GameUi = ({ engine }: IGameUI) => {
  // game status params
  const [lives, setLives] = useGameStore(
    (state) => [state.lives, state.updateLives],
    shallow,
  );
  const [countdown, setCountdown] = useGameStore(
    (state) => [state.countdown, state.updateCountdown],
    shallow,
  );
  const [waveNumber, setWaveNumber] = useGameStore(
    (state) => [state.waveNumber, state.updateWaveNumber],
    shallow,
  );
  const [isGameMenuOpen, setIsGameMenuOpen] = useGameStore(
    (state) => [state.isGameMenuOpen, state.updateIsGameMenuOpen],
    shallow,
  );
  const [isSideMenuOpen, setIsSideMenuOpen] = useGameStore(
    (state) => [state.isSideMenuOpen, state.updateIsSideMenuOpen],
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
  const [score, setScore] = useGameStore(
    (state) => [state.score, state.updateScore],
    shallow,
  );
  const [money, setMoney] = useGameStore(
    (state) => [state.money, state.updateMoney],
    shallow,
  );
  const [enemiesLeft, setEnemiesLeft] = useGameStore(
    (state) => [state.enemiesLeft, state.updateEnemiesLeft],
    shallow,
  );
  //

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(
    engine.isSoundEnabled,
  );

  return (
    <>
      {/* UI Game icons */}
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
            color: "#262626",
          },
          "& > .game-menu-icon": {
            cursor: "pointer",
            width: "32px",
            height: "32px",
            background: `url(${gameUIIcons}) 0 0 no-repeat`,
          },
          "& > .game-build-icon": {
            cursor: "pointer",
            width: "32px",
            height: "32px",
            marginTop: "16px",
            background: `url(${gameUIIcons}) 0 -32px no-repeat`,
          },
        }}
      >
        {isSideMenuOpen ? (
          <Typography
            onClick={() => {
              // toggle side menu
              setIsSideMenuOpen(!isSideMenuOpen);
              // clear tower selection
              engine.clearTowerSelection(engine.selectedTower!);
            }}
          >
            X
          </Typography>
        ) : (
          <>
            <Box
              onClick={() => {
                // toggle game menu
                setIsGameMenuOpen(!isGameMenuOpen);
              }}
              className="game-menu-icon"
            />
            {!isGameMenuOpen && (
              <Box
                onClick={() => {
                  // toggle game menu
                  setIsBuildMenuOpen(!isBuildMenuOpen);
                }}
                className="game-build-icon"
              />
            )}
          </>
        )}
      </Box>
      <SideMenu engine={engine} />
      {isGameOver && !isGameMenuOpen && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 100,
            width: "100%",
            height: "100%",
            display: "flex",
            "& p": {
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              color: "#262626",
              fontSize: "4em",
            },
          }}
        >
          <Typography>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <marquee behavior="alternate" scrollamount="12">
              GAME IS OVER!
            </marquee>
          </Typography>
        </Box>
      )}
      <Box
        className="b-game-status"
        sx={{
          position: "absolute",
          zIndex: 101,
          top: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            "& > p": {
              textAlign: "center",
              color: "#262626",
            },
          }}
        >
          <Typography>
            <span>{`Money: $${money}`}</span>&nbsp;
            <span>{`Lives: ${lives}`}</span>&nbsp;
            <span>{`Enemies: ${enemiesLeft}`}</span>&nbsp;
            <span>{`Wave: ${waveNumber}`}</span>&nbsp;
            <span>{`Score: ${score}`}</span>&nbsp;
          </Typography>
          <Typography>
            {Boolean(countdown) && (
              <span>{`Next wave in: ${countdown} seconds`}</span>
            )}
          </Typography>
        </Box>
      </Box>
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
                  setIsGameStarted(true);
                }
                setIsGameMenuOpen(false);
              }}
            >
              {isGameStarted ? "Resume" : "Start"} game
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (isGameStarted) {
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
    </>
  );
};

export default GameUi;
