import React, { useState } from "react";
import { Box, MenuList, MenuItem, Typography, Button } from "@mui/material";
import { shallow } from "zustand/shallow";
import gameUIIcons from "@/../public/UI/gameUIIcons.png";
import manaIcon from "@/../public/sprites/spells/manaIcon.png";
import { TDEngine, IWaveGenerator } from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";

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
  const [mana, setMana] = useGameStore(
    (state) => [state.mana, state.updateMana],
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
        {!isSideMenuOpen && (
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
          top: "8px",
          zIndex: 101,
          width: "100%",
          userSelect: "none",
        }}
      >
        <Box
          sx={{
            background: `url(${manaIcon}) 0 0 no-repeat`,
            height: "32px",
            paddingLeft: "32px",
            paddingTop: "10px",
            position: "absolute",
            top: "8px",
            left: "16px",
            "& p": {
              color: "white",
            },
          }}
        >
          <Typography>{mana}</Typography>
        </Box>
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
    </>
  );
};

export default GameUi;
