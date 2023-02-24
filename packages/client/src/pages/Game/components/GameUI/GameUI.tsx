import React, { useEffect, useState } from "react";
import styles from "./GameUI.module.css";
import TDEngine, { IWaveGenerator } from "@/pages/Game/engine/TDEngine";
interface IGameUI {
  engine: TDEngine;
  setIsGameStarted: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  isGameStarted: boolean;
  lives?: number;
  score?: number;
  money?: number;
  wave?: IWaveGenerator["waveParams"]["currentWave"];
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
  const [countdown, setCountdown] = useState(
    engine.waveGenerator?.waveCountdown,
  );
  const [enemiesLeft, setEnemiesLeft] = useState<IGameUI["wave"]>(
    engine.enemies?.length,
  );
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
      if (isGameOver) {
        setIsGameOver(false);
        engine.sound?.soundArr?.gameStart?.pause();
        engine.sound!.soundArr.gameStart!.currentTime = 0;
      }
      //
    };
  }, []);

  return (
    <div className={styles["b-game-status"]}>
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
      <div>
        <button
          onClick={() => {
            engine.isGameStarted = true;
            setIsGameStarted(true);
            // game start play sound
            engine.sound?.soundArr?.gameStart?.play();
          }}
        >
          Start
        </button>
        <button
          onClick={() => {
            engine.isGameStarted = false;
            setIsGameStarted(false);
            // game start pause sound
            engine.sound?.soundArr?.gameStart?.pause();
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
          Build 1 level tower($
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
          Build 2 level tower($
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
          Build 3 level tower($
          {engine.predefinedTowerParams.one!.towerParams.price})
        </button>
      </div>
    </div>
  );
};

export default GameUi;
