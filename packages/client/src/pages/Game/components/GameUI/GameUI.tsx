import React, { useEffect, useState } from "react";
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
  const [selectedTower, setSelectedTower] =
    useState<ITDEngine["selectedTower"]>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    engine.UICallback = () => {
      // update game results
      setScore(engine.score);
      setCountdown(engine.waveGenerator?.waveCountdown);
      setLives(engine.lives);
      setMoney(engine.money);
      setWave(engine.waveGenerator?.waveParams.currentWave);
      setEnemiesLeft(engine.enemies?.length);
      if (engine.lives < 1) {
        setIsGameOver(false);
        engine.sound?.soundArr?.gameStart?.pause();
        engine.sound!.soundArr.gameStart!.currentTime = 0;
      }
      // is tower selected?
      setSelectedTower(engine.selectedTower);
    };
  }, []);

  return (
    <div className="b-game-status">
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
      <hr />
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
      {selectedTower ? (
        <div className="b-tower-upgrade-menu">
          <button
            disabled={
              !engine.isEnoughMoney(engine.selectedTower!.towerParams.price)
            }
            onClick={() => {
              engine.upgradeTower(engine.selectedTower!);
            }}
          >
            Upgrade tower
          </button>
        </div>
      ) : (
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
    </div>
  );
};

export default GameUi;
