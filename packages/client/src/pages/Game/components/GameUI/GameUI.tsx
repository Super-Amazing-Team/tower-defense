import React, { useEffect, useState } from "react";
import {
  Box,
  Fade,
  MenuList,
  MenuItem,
  Typography,
  Button,
  createTheme,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Image } from "@mui/icons-material";
import sidePanelBg from "@/../public/UI/sidePanelBg.png";
import {
  TDEngine,
  ITDEngine,
  IWaveGenerator,
} from "@/pages/Game/engine/TDEngine";

interface IGameUI {
  engine: TDEngine;
  setIsGameStarted: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  isGameStarted: boolean;
  lives?: number;
  score?: number;
  money?: number;
  wave?: IWaveGenerator["waveParams"]["currentWave"];
  waveCountdown?: IWaveGenerator["waveCountdown"];
  isEnoughMoney?: boolean;
}
const GameUi: React.FC<IGameUI> = ({
  engine,
  isGameStarted,
  setIsGameStarted,
}) => {
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
  // game status params
  const [lives, setLives] = useState<IGameUI["lives"]>(
    engine.initialGameParams.lives,
  );
  const [score, setScore] = useState<IGameUI["score"]>(engine.score);
  const [money, setMoney] = useState<IGameUI["money"]>(
    engine.initialGameParams.money,
  );
  const [wave, setWave] = useState<IGameUI["wave"]>(
    engine.waveGenerator?.waveParams.currentWave,
  );
  const [countdown, setCountdown] = useState<IGameUI["waveCountdown"]>(
    engine.waveGenerator?.waveCountdown,
  );
  const [enemiesLeft, setEnemiesLeft] = useState<IGameUI["wave"]>(
    engine.enemies?.length,
  );
  const [selectedTower, setSelectedTower] = useState<
    ITDEngine["selectedTower"]
  >(engine.selectedTower);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState<boolean>(false);
  const [isGameMenuOpen, setIsGameMenuOpen] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(
    engine.isSoundEnabled,
  );
  const [constructionProgress, setConstructionProgress] = useState<number>(0);
  const [isTowerCanBeUpgraded, setIsTowerCanBeUpgraded] =
    useState<boolean>(true);

  const percentToProgressBarString = (percent: number) => {
    let result = "[oooooooooo]";
    if (percent > 0) {
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
      } else if (percent === 100) {
        result = "[xxxxxxxxxx]";
      }
    }
    return result;
  };

  useEffect(() => {
    if (!engine.UICallback) {
      engine.UICallback = () => {
        // update game results
        setScore(engine.score);
        setCountdown(engine.waveGenerator?.waveCountdown);
        setLives(engine.lives);
        setMoney(engine.money);
        setWave(engine.waveGenerator?.waveParams.currentWave);
        setEnemiesLeft(engine.enemies?.length);
        // setSelectedTower(engine.selectedTower);
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
    }
    // debug
    console.log(`isTowerCanBeUpgraded`);
    console.log(isTowerCanBeUpgraded);
    //
    engine.UIGameIsOver = setIsGameOver;
    engine.UISetIsSideMenuOpen = setIsSideMenuOpen;
    engine.UISetIsGameMenuOpen = setIsGameMenuOpen;
    engine.UISetIsBottomMenuOpen = setIsBottomMenuOpen;
    engine.UISetSelectedTower = setSelectedTower;
    engine.UISetConstructionProgress = setConstructionProgress;
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
              {constructionProgress &&
              selectedTower?.renderParams?.isConstructing ? (
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
                      <span>{`${
                        engine.selectedTower?.upgradeLevel! + 1
                      }`}</span>
                    </Typography>
                    <Typography paragraph={true}>
                      Damage:{" "}
                      <span>{`${engine.selectedTower?.towerParams?.attackDamage}`}</span>
                    </Typography>
                    <Typography paragraph={true}>
                      Attack speed:{" "}
                      <Box component="span">{`${engine.selectedTower?.towerParams?.attackRate}`}</Box>
                    </Typography>
                    <Typography paragraph={true}>
                      Attack range:{" "}
                      <Box component="span">{`${engine.selectedTower?.towerParams?.attackRange}`}</Box>
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", mt: "2em" }}
                  >
                    <Button
                      disabled={
                        isTowerCanBeUpgraded &&
                        !engine.isEnoughMoney(
                          engine.selectedTower?.towerParams.price,
                        )
                      }
                      onClick={() => {
                        engine.upgradeTower(engine.selectedTower!);
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
                        (engine.selectedTower?.towerParams?.price! *
                          (engine.selectedTower?.upgradeLevel! + 1)) /
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
        {/* : (
          <div className="b-building-menu">
            <div>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.one!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("one", 0);
                }}
              >
                Tower 1 level 1($
                {engine.predefinedTowerParams.one!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.one!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("one", 1);
                }}
              >
                Tower 1 level 2($
                {engine.predefinedTowerParams.one!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.one!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("one", 2);
                }}
              >
                Tower 1 level 3($
                {engine.predefinedTowerParams.one!.towerParams.price})
              </button>
            </div>
            <div>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.two!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("two", 0);
                }}
              >
                Tower 2 level 1($
                {engine.predefinedTowerParams.two!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.two!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("two", 1);
                }}
              >
                Tower 2 level 2($
                {engine.predefinedTowerParams.two!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.two!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("two", 2);
                }}
              >
                Tower 2 level 3($
                {engine.predefinedTowerParams.two!.towerParams.price})
              </button>
            </div>
            <div>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.three!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("three", 0);
                }}
              >
                Tower 3 level 1($
                {engine.predefinedTowerParams.three!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.three!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("three", 1);
                }}
              >
                Tower 3 level 2($
                {engine.predefinedTowerParams.three!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.three!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("three", 2);
                }}
              >
                Tower 3 level 3($
                {engine.predefinedTowerParams.three!.towerParams.price})
              </button>
            </div>
            <div>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.four!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("four", 0);
                }}
              >
                Tower 4 level 1($
                {engine.predefinedTowerParams.four!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.four!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("four", 1);
                }}
              >
                Tower 4 level 2($
                {engine.predefinedTowerParams.four!.towerParams.price})
              </button>
              <button
                disabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams.four!.towerParams.price,
                  )
                }
                onClick={() => {
                  engine.buildTower("four", 2);
                }}
              >
                Tower 4 level 3($
                {engine.predefinedTowerParams.four!.towerParams.price})
              </button>
            </div>
          </div>
        )}
        */}
      </Box>
      <Box
        className="b-game-status"
        sx={{
          position: "absolute",
          zIndex: engine.canvasZIndex.projectile + 1,
          bottom: 0,
        }}
      >
        <Box>
          <img
            src="/UI/gear.png"
            width={engine.map?.mapParams?.gridStep}
            height={engine.map?.mapParams?.gridStep}
            alt={"Toggle game menu"}
          />
        </Box>
        {isGameOver && <h1>GAME IS OVER!</h1>}
        <div>
          <Typography>
            {Boolean(countdown) && (
              <span>{`Next wave in: ${countdown} seconds`}</span>
            )}
          </Typography>
          <Typography>
            <span>{`Enemies left: ${enemiesLeft}`}</span>&nbsp;
            <span>{`Current wave: ${wave}`}</span>&nbsp;
            <span>{`Lives left: ${lives}`}</span>&nbsp;
            <span>{`Killed enemies: ${score}`}</span>&nbsp;
            <span>{`Money: $${money}`}</span>
            &nbsp;
          </Typography>
        </div>
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
                if (!engine.isGameStarted) {
                  engine.isGameStarted = true;
                  setIsGameStarted(true);
                }
                engine.isGameMenuOpen = false;
                setIsGameMenuOpen(false);
              }}
            >
              {engine.isGameStarted ? "Resume" : "Start"} game
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (engine.isGameStarted) {
                  engine.isGameStarted = false;
                  setIsGameStarted(false);
                }
                setIsGameMenuOpen(false);
              }}
              disabled={!engine.isGameStarted}
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
