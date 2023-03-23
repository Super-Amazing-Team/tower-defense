import React, { useEffect, useState } from "react";
import {
  Box,
  MenuList,
  MenuItem,
  Typography,
  Button,
  createTheme,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { shallow } from "zustand/shallow";
import sidePanelBg from "@/../public/UI/sidePanelBg.png";
import gearBg from "@/../public/UI/gear.png";
import {
  TDEngine,
  ITDEngine,
  IWaveGenerator,
} from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";

interface IGameUI {
  engine: TDEngine;
  lives?: number;
  score?: number;
  money?: number;
  wave?: IWaveGenerator["waveParams"]["currentWave"];
  waveCountdown?: IWaveGenerator["waveCountdown"];
  isEnoughMoney?: boolean;
}

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

const GameUi: React.FC<IGameUI> = ({ engine }) => {
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
  const [isGameStarted, setIsGameStarted] = useGameStore(
    (state) => [state.isGameStarted, state.updateIsGameStarted],
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

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(
    engine.isSoundEnabled,
  );

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

  useEffect(() => {
    // debug
    console.log(`selectedTower`);
    console.log(selectedTower);
    //

    /*
    engine.UICallback = () => {
      //
      setSelectedTower(engine.selectedTower);
      // update game results
      setScore(engine.score);
      setCountdown(engine.waveGenerator?.waveCountdown);
      setLives(engine.lives);
      setMoney(engine.money);
      setWave(engine.waveGenerator?.waveParams.currentWave);
      setEnemiesLeft(engine.enemies?.length);
      if (engine.lives < 1) {
        setIsGameOver(true);
        engine.sound?.soundArr?.gameStart?.pause();
        engine.sound!.soundArr.gameStart!.currentTime = 0;
      } else {
        if (isGameOver) {
          setIsGameOver(false);
        }
      }
      // is tower selected?
      setIsTowerCanBeUpgraded(
        engine.selectedTower
          ? engine.selectedTower.upgradeLevel <
              engine.selectedTower.towerParams.maxUpgradeLevel!
          : false,
      );
    };
    engine.UIGameIsOver = setIsGameOver;
    engine.UISetIsSideMenuOpen = setIsSideMenuOpen;
    engine.UISetIsGameMenuOpen = setIsGameMenuOpen;
    engine.UISetIsBottomMenuOpen = setIsBottomMenuOpen;
    engine.UISetSelectedTower = setSelectedTower;
    engine.UISetConstructionProgress = setConstructionProgress;

     */
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          zIndex: isSideMenuOpen ? 100 : 50,
          width: `270px`,
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: isSideMenuOpen ? "flex" : "none",
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
                <Typography paragraph={true} sx={{ pt: 3 }}>
                  IS CONSTRUCTING:
                  <span>
                    {percentToProgressBarString(constructionProgress)}
                  </span>
                </Typography>
              ) : (
                <>
                  <Box>
                    <Typography paragraph={true}>
                      Tower Level:{" "}
                      <span>{`${selectedTower?.upgradeLevel! + 1}`}</span>
                    </Typography>
                    <Typography paragraph={true}>
                      Damage:{" "}
                      <span>{`${selectedTower?.towerParams?.attackDamage}`}</span>
                    </Typography>
                    <Typography paragraph={true}>
                      Attack speed:{" "}
                      <Box component="span">{`${selectedTower?.towerParams?.attackRate}`}</Box>
                    </Typography>
                    <Typography paragraph={true}>
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
          "& > div": {
            cursor: "pointer",
            width: "32px",
            height: "32px",
            background: `url("${gearBg}") 0 ${
              isSideMenuOpen && !isGameMenuOpen ? "-32px" : "0"
            } no-repeat`,
          },
        }}
      >
        <Box
          onClick={() => {
            // toggle game menu
            setIsGameMenuOpen(!isGameMenuOpen);
          }}
        />
      </Box>
      <Box
        className="b-game-status"
        sx={{
          position: "absolute",
          zIndex: engine.canvasZIndex.projectile + 1,
          bottom: 0,
          width: "100%",
        }}
      >
        {isGameOver && <h1>GAME IS OVER!</h1>}
        <Box
          sx={{
            "& > p": {
              textAlign: "center",
            },
          }}
        >
          <Typography>
            {Boolean(countdown) && (
              <span>{`Next wave in: ${countdown} seconds`}</span>
            )}
          </Typography>
          <Typography>
            <span>{`Money: $${money}`}</span>&nbsp;
            <span>{`Lives: ${lives}`}</span>&nbsp;
            <span>{`Enemies: ${enemiesLeft}`}</span>&nbsp;
            <span>{`Wave: ${waveNumber}`}</span>&nbsp;
            <span>{`Score: ${score}`}</span>&nbsp;
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
              disabled={!isGameStarted}
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
    </ThemeProvider>
  );
};

export default GameUi;
