import React, { useEffect, useRef, useState } from "react";
import { Box, Fade } from "@mui/material";
import TDEngine, {
  ITDEngine,
  IWaveGenerator,
} from "@/pages/Game/engine/TDEngine";
interface IGameUI {
  engine: TDEngine;
  isGameStarted: boolean;
  setIsGameStarted: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  isForceRender: boolean;
  setIsForceRender: (value: boolean | ((prevVar: boolean) => boolean)) => void;
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
  const [isGameMenuOpen, setIsGameMenuOpen] = useState<boolean>(
    engine.isGameMenuOpen,
  );
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(
    engine.isSoundEnabled,
  );
  const [constructionProgress, setConstructionProgress] = useState<number>(0);
  const [isTowerCanBeUpgraded, setIsTowerCanBeUpgraded] =
    useState<boolean>(true);

  useEffect(() => {
    // debug
    console.log(`engine!`);
    console.log(engine!);
    //

    // set UI callback
    engine.UICallback = () => {
      // update game results
      setScore(engine.score);
      setCountdown(engine.waveGenerator?.waveCountdown);
      setLives(engine.lives);
      setMoney(engine.money);
      setWave(engine.waveGenerator?.waveParams.currentWave);
      setEnemiesLeft(engine.enemies?.length);
      setSelectedTower(engine.selectedTower);
      if (engine.lives < 1) {
        setIsGameOver(true);
        engine.sound?.soundArr?.gameStart?.pause();
        engine.sound!.soundArr.gameStart!.currentTime = 0;
      }
      // is tower selected?
      setSelectedTower(engine.selectedTower);
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
    engine.UISetConstructionProgress = setConstructionProgress;
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          zIndex: isSideMenuOpen ? 100 : 50,
          width: `${Math.floor(engine.map?.mapParams?.width! / 4)}px`,
          height: "100%",
        }}
      >
        <Fade in={isSideMenuOpen} className="b-tower-upgrade-menu-wrapper">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: "#ffb357",
            }}
          >
            {constructionProgress &&
            selectedTower?.renderParams?.isConstructing ? (
              <Box>IS CONSTRUCTING {`${constructionProgress}`}%</Box>
            ) : (
              <>
                <Box>
                  <p>
                    Tower Level: {`${engine.selectedTower?.upgradeLevel! + 1}`}
                  </p>
                  <p>
                    Damage:{" "}
                    {`${engine.selectedTower?.towerParams?.attackDamage}`}
                  </p>
                  <p>
                    Attack speed:{" "}
                    {`${engine.selectedTower?.towerParams?.attackRate}`}
                  </p>
                  <p>
                    Attack range:{" "}
                    {`${engine.selectedTower?.towerParams?.attackRange}`}
                  </p>
                </Box>
                {isTowerCanBeUpgraded && (
                  <button
                    disabled={
                      !engine.isEnoughMoney(
                        engine.selectedTower?.towerParams.price,
                      )
                    }
                    onClick={() => {
                      engine.upgradeTower(engine.selectedTower!);
                    }}
                  >
                    Upgrade tower
                  </button>
                )}
                <button
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
                </button>
              </>
            )}
          </Box>
        </Fade>
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
        {isGameOver && <h1>GAME IS OVER!</h1>}
        <div>
          <p>
            <span>{`Enemies left: ${enemiesLeft}`}</span>&nbsp;
            <span>{`Current wave: ${wave}`}</span>&nbsp;
            <span>{`Lives left: ${lives}`}</span>&nbsp;
            <span>{`Killed enemies: ${score}`}</span>&nbsp;
            <span>{`Money: $${money}`}</span>
            &nbsp;
          </p>
          <p>
            {Boolean(countdown) && (
              <span>{`Next wave in: ${countdown} seconds`}</span>
            )}
          </p>
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
          background: "#ccc",
        }}
      >
        <Box
          className="b-game-menu"
          sx={{
            position: "relative",
            display: "flex",
          }}
        >
          <Box
            className="b-game-menu-content"
            sx={{
              alignItems: "center",
            }}
          >
            <button
              onClick={() => {
                if (!isGameStarted) {
                  engine.isGameStarted = true;
                  setIsGameStarted(true);
                }
                setIsGameMenuOpen(false);
              }}
            >
              {engine.isGameStarted ? "Resume" : "Start"} game
            </button>
            <button
              onClick={() => {
                if (isGameStarted) {
                  engine.isGameStarted = false;
                  setIsGameStarted(false);
                }
                setIsGameMenuOpen(false);
              }}
              disabled={!engine.isGameStarted}
            >
              Pause game
            </button>
            <button
              onClick={() => {
                engine.gameRestart();
                setIsGameStarted(!isGameStarted);
                setIsGameMenuOpen(false);
              }}
            >
              Restart game
            </button>
            <button
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
            </button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default GameUi;
