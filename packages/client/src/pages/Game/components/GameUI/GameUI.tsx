import React, { useState } from "react";
import { Box, MenuList, MenuItem, Typography, Button } from "@mui/material";
import { shallow } from "zustand/shallow";
import gameUIIcons from "../../../../../public/UI/gameUIIcons.png";
import sidePanelBg from "@/../public/UI/sidePanelBg.png";
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

const percentToProgressBarString = (percent: number) => {
  let result = "[]";
  if (percent >= 0) {
    if (percent < 10) {
      result = "[xooooooooo]";
    } else if (percent < 20) {
      result = "[xxoooooooo]";
    } else if (percent < 30) {
      result = "[xxxooooooo]";
    } else if (percent < 40) {
      result = "[xxxxoooooo]";
    } else if (percent < 50) {
      result = "[xxxxxooooo]";
    } else if (percent < 60) {
      result = "[xxxxxxoooo]";
    } else if (percent < 70) {
      result = "[xxxxxxxooo]";
    } else if (percent < 80) {
      result = "[xxxxxxxxoo]";
    } else if (percent < 90) {
      result = "[xxxxxxxxxo]";
    } else if (percent <= 100) {
      result = "[xxxxxxxxxx]";
    }
  }
  return result;
};

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
  const [constructionProgress, setConstructionProgress] = useGameStore(
    (state) => [state.constructionProgress, state.updateConstructionProgress],
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
  const [selectedTower, setSelectedTower] = useGameStore(
    (state) => [state.selectedTower, state.updateSelectedTower],
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

  // @ts-ignore
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          right: isSideMenuOpen ? "0px" : `-${engine.map?.tileToNumber(4)}px`,
          zIndex: 100,
          width: `${engine.map?.tileToNumber(4)}px`,
          height: "100%",
          transition: "all 500ms ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
          }}
          className="b-tower-upgrade-menu-wrapper"
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: `url(${sidePanelBg}) repeat`,
              borderLeft: "3px solid #bd6a62",
            }}
          >
            <Box
              sx={{
                "& p:first-of-type": {
                  padding: "3em 1.5em 1em",
                },
                "& p": {
                  padding: "1em 1.5em",
                },
                "& span": {
                  color: "red",
                  fontSize: "1.2em",
                },
              }}
            >
              {selectedTower?.renderParams.isConstructing &&
              !selectedTower?.renderParams.isConstructionEnd ? (
                <>
                  <Typography
                    sx={{
                      mt: 3,
                    }}
                  >
                    Building:
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "red",
                      "& > span": {
                        fontSize: "1.5em",
                      },
                    }}
                  >
                    <span>
                      {percentToProgressBarString(constructionProgress)}
                    </span>
                  </Typography>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      mt: 3,
                    }}
                  >
                    <Typography>
                      Tower Level:{" "}
                      <span>{`${selectedTower?.upgradeLevel! + 1}`}</span>
                    </Typography>
                    <Typography>
                      Damage:{" "}
                      <span>{`${selectedTower?.towerParams?.attackDamage}`}</span>
                    </Typography>
                    <Typography>
                      Attack speed:{" "}
                      <Box component="span">{`${selectedTower?.towerParams?.attackRate}`}</Box>
                    </Typography>
                    <Typography>
                      Attack range:{" "}
                      <Box component="span">{`${selectedTower?.towerParams?.attackRange}`}</Box>
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", mt: "2em" }}
                  >
                    <Button
                      disabled={
                        selectedTower?.upgradeLevel! ===
                          selectedTower?.towerParams.maxUpgradeLevel! ||
                        !engine.isEnoughMoney(selectedTower?.towerParams.price)
                      }
                      onClick={() => {
                        engine.upgradeTower(selectedTower!);
                      }}
                    >
                      Upgrade tower
                    </Button>
                    <Button
                      disabled={
                        !engine.isEnoughMoney(
                          engine.selectedTower?.towerParams.price,
                        )
                      }
                      onClick={() => {
                        engine.sellTower(engine.selectedTower!);
                      }}
                    >
                      Sell Tower(
                      {`${Math.floor(
                        (selectedTower?.towerParams?.price! *
                          (selectedTower?.upgradeLevel! + 1)) /
                          2,
                      )}$`}
                      )
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
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
            <marquee scrollamount="12">GAME IS OVER!</marquee>
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
