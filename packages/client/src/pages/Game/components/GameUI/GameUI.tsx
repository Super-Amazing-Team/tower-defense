import React, { useEffect, useState } from "react";
import { Box, Fade } from "@mui/material";
import TDEngine, {
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
  const [constructionProgress, setConstructionProgress] = useState<number>(0);
  const [isTowerCanBeUpgraded, setIsTowerCanBeUpgraded] =
    useState<boolean>(true);

  useEffect(() => {
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
    engine.UISetIsBottomMenuOpen = setIsBottomMenuOpen;
    engine.UISetConstructionProgress = setConstructionProgress;
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          zIndex: 100,
          width: `${Math.floor(engine.map?.mapParams?.width! / 5)}px`,
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
                  )}`}
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
          zIndex: 100,
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
        <div className="b-game-menu">
          <button
            onClick={() => {
              engine.isGameStarted = true;
              setIsGameStarted(true);
              // game start play sound
              // engine.sound?.soundArr?.gameStart?.play();
            }}
          >
            Start
          </button>
          <button
            onClick={() => {
              engine.isGameStarted = false;
              setIsGameStarted(false);
              // game start pause sound
              // engine.sound?.soundArr?.gameStart?.pause();
            }}
          >
            Pause
          </button>
          <button
            onClick={() => {
              engine.gameRestart();
              setIsGameStarted(!isGameStarted);
            }}
          >
            Restart
          </button>
        </div>
      </Box>
    </>
  );
};

export default GameUi;
