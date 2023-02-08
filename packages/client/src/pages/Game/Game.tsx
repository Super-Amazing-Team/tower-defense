import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import TDEngine, { ITDEngine, IWaveGenerator } from "./engine/TDEngine";
import Tower from "@/pages/Game/towers/Tower";
import Enemy from "@/pages/Game/enemies/Enemy";
import Map from "@/pages/Game/maps/Map";
import Projectile from "@/pages/Game/projectiles/Projectile";

// polyfill
if (!window.requestIdleCallback) {
  // @ts-ignore
  window.requestIdleCallback = function (
    callback: IdleRequestCallback,
    options: Record<string, string | number> = {},
  ): NodeJS.Timeout {
    let relaxation = 1;
    let timeout = options?.timeout || relaxation;
    let start = performance.now();
    return setTimeout(function () {
      callback({
        get didTimeout() {
          return options.timeout
            ? false
            : performance.now() - start - relaxation > timeout;
        },
        timeRemaining: function () {
          return Math.max(0, relaxation + (performance.now() - start));
        },
      });
    }, relaxation);
  };
}
if (!window.cancelIdleCallback) {
  window.cancelIdleCallback = function (id) {
    clearTimeout(id);
  };
}

export interface IGameProps extends PropsWithChildren {
  engine?: TDEngine;
  lives?: number;
  score?: number;
  money?: number;
  wave?: IWaveGenerator["waveParams"]["currentWave"];
  isEnoughMoney?: boolean;
}

export const Game: FC<IGameProps> = ({ engine = new TDEngine() }) => {
  // canvas ref
  const canvas = useRef<HTMLCanvasElement>(null);
  const mapCanvas = useRef<HTMLCanvasElement>(null);
  const enemyCanvas = useRef<HTMLCanvasElement>(null);
  // game window ref
  const gameWindow = useRef<HTMLDivElement>(null);
  // tower sprite img
  const towerOneImage = useRef<HTMLImageElement>(null);
  const towerTwoImage = useRef<HTMLImageElement>(null);
  const towerThreeImage = useRef<HTMLImageElement>(null);
  // enemy sprite img
  const enemyOneImage = useRef<HTMLImageElement>(null);
  const enemyFastImage = useRef<HTMLImageElement>(null);
  const enemySlowImage = useRef<HTMLImageElement>(null);
  const enemyBossImage = useRef<HTMLImageElement>(null);
  // projectile sprite img
  const projectileOneImage = useRef<HTMLImageElement>(null);
  const projectileTwoImage = useRef<HTMLImageElement>(null);
  const projectileThreeImage = useRef<HTMLImageElement>(null);
  // projectile hit img
  const projectileHitOneImage = useRef<HTMLImageElement>(null);
  const projectileHitTwoImage = useRef<HTMLImageElement>(null);
  const projectileHitThreeImage = useRef<HTMLImageElement>(null);
  // game status params
  const [lives, setLives] = useState<IGameProps["lives"]>(
    engine.initialGameParams.lives,
  );
  const [score, setScore] = useState<IGameProps["score"]>(engine.score);
  const [money, setMoney] = useState<IGameProps["money"]>(
    engine.initialGameParams.money,
  );
  const [wave, setWave] = useState<IGameProps["wave"]>(
    engine.waveGenerator?.waveParams.currentWave,
  );
  const [countdown, setCountdown] = useState(
    engine.waveGenerator?.waveCountdown,
  );
  const [enemiesLeft, setEnemiesLeft] = useState<IGameProps["wave"]>(
    engine.enemies?.length,
  );
  const [isNotEnoughMoney, setIsNotEnoughMoney] = useState<
    ITDEngine["isNotEnoughMoney"]
  >(engine.isNotEnoughMoney);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const gameLoop = () => {
    if (engine.isGameStarted) {
      if (engine.lives > 0) {
        engine.clearCanvas();

        // draw level map
        engine.map?.drawMap();

        // draw map grid
        if (engine.isShowGrid) {
          engine.map?.drawGrid();
        }

        // draw level map
        engine.map?.drawMap();

        // draw towers
        engine.towers?.forEach((tower: Tower) => {
          tower.drawTower();
        });

        // build mode
        if (engine.isCanBuild) {
          if (engine.draftTower) {
            engine.draftTower.draftBuildTower();
          }
        }
        // draw enemies
        engine.enemies?.forEach((enemy: Enemy) => {
          enemy.move();
        });

        // move projectiles
        if (engine.projectiles) {
          engine.projectiles?.forEach((projectile: Projectile) => {
            if (!projectile.target) {
              projectile.destroy();
            } else if (
              projectile.target.currentPosition.x <
              projectile.tower.engine.map?.mapParams.startX!
            ) {
              return;
            } else if (
              projectile.target.currentPosition.x >
              projectile.tower.engine.map?.mapParams?.width!
            ) {
              return;
            } else {
              projectile.move();
            }
          });
        }

        // debug
        // engine.highlightTile(engine.map!.mapParams.closestTile);
        //
      } else {
        // GAME IS OVER!
      }

      // request animation frame
      engine.animationFrameId = requestAnimationFrame(gameLoop);
    } else {
      // cancel browser idle callback fn
      cancelAnimationFrame(engine.animationFrameId);
    }
  };

  const gameLoopLogic = () => {
    if (engine.isGameStarted) {
      // update game results
      setScore(engine.score);
      setCountdown(engine.waveGenerator?.waveCountdown);
      setLives(engine.lives);
      setMoney(engine.money);
      setWave(engine.waveGenerator?.waveParams.currentWave);
      setEnemiesLeft(engine.enemies?.length);
      setIsNotEnoughMoney(engine.isNotEnoughMoney);
      if (!engine.lives) {
        setIsGameOver(true);
      } else {
        setIsGameOver(false);
      }

      // enemy init || move
      if (!engine.waveGenerator?.isInitialized) {
        if (!engine.waveGenerator?.waveTimerBetweenWaves) {
          // UI countdown between waves
          engine.waveGenerator?.countdown();
          engine.waveGenerator!.waveTimerBetweenWaves = setTimeout(() => {
            engine.waveGenerator?.init();
          }, engine.waveGenerator?.waveTimeoutBetweenWaves);
        }
      } else {
        // isWaveInProgress?
        if (
          engine.enemies?.length === 0 &&
          engine.waveGenerator?.waveParams.isWaveInProgress
        ) {
          engine.waveGenerator.waveParams.isWaveInProgress = false;
          engine.waveGenerator!.waveCountdown! = Math.floor(
            engine.waveGenerator!.waveTimeoutBetweenWaves / 1000,
          );
          if (!engine.waveGenerator.waveTimerBetweenWaves) {
            // UI countdown between waves
            engine.waveGenerator.waveCountdownTimer = setInterval(() => {
              if (engine.waveGenerator!.waveCountdown > 0) {
                engine.waveGenerator!.waveCountdown -= 1;
              } else {
                clearInterval(engine.waveGenerator?.waveCountdownTimer!);
                engine.waveGenerator!.isUICountdown = false;
              }
            }, 1000);
            setTimeout(() => {
              engine.clearMemory();
              engine.waveGenerator?.spawnEnemies();
            }, engine.waveGenerator.waveTimeoutBetweenWaves);
          }
        }
      }

      // search n destroy
      if (engine.enemies?.length) {
        engine.towers?.forEach((tower: Tower) => {
          if (tower.target) {
            if (tower.isEnemyInRange(tower.target)) {
              tower.findTargetVector();
              tower.fire();
            } else {
              tower.findTarget();
            }
          } else {
            tower.findTarget();
          }
        });
      }

      // destroy projectiles without target
      if (engine.projectiles?.length) {
        engine.projectiles?.forEach((projectile: Projectile) => {
          if (projectile.tower.target === null) {
            engine.projectiles?.filter(
              (proj: Projectile) => projectile !== proj,
            );
          }
        });
      }

      // request callback when browser is idling
      engine.requestIdleCallback = requestIdleCallback(gameLoopLogic, {
        timeout: engine.idleTimeout,
      });
    } else {
      cancelIdleCallback(engine.requestIdleCallback);
    }
  };

  useEffect(() => {
    if (!engine.context) {
      engine.setContext(canvas.current?.getContext("2d")!);
      engine.setMapContext(mapCanvas.current?.getContext("2d")!);
      engine.setEnemyContext(enemyCanvas.current?.getContext("2d")!);
    }

    if (!engine.map) {
      // set new map
      engine.map = new Map(engine);
    }

    /* BUILD MODE */
    // add canvas mousemove event listener
    canvas.current?.addEventListener(
      "mousemove",
      engine.canvasMouseMoveCallback,
    );
    // add canvas mouse click event listener
    canvas.current?.addEventListener("click", engine.canvasClickCallback);
    // add escape hotkey to cancel building mode
    gameWindow.current?.addEventListener("keydown", engine.gameWindowKeydown);
    /* /BUILD MODE */

    /* LOAD SPRITES */
    if (!Object.keys(engine.towerSprites).length) {
      // tower sprites
      engine.towerSprites = {
        levelOne: towerOneImage.current,
        levelTwo: towerTwoImage.current,
        levelThree: towerThreeImage.current,
      };
    }

    if (!Object.keys(engine.projectileSprites).length) {
      // projectile sprites
      engine.projectileSprites = {
        levelOne: projectileOneImage.current,
        levelTwo: projectileTwoImage.current,
        levelThree: projectileThreeImage.current,
      };
    }

    if (!Object.keys(engine.projectileHitSprites).length) {
      // projectile hit sprites
      engine.projectileHitSprites = {
        levelOne: projectileHitOneImage.current,
        levelTwo: projectileTwoImage.current,
        levelThree: projectileThreeImage.current,
      };
    }

    if (!Object.keys(engine.enemies!).length) {
      // projectile hit sprites
      engine.enemySprites = {
        levelOne: enemyOneImage.current,
        fast: enemyFastImage.current,
        slow: enemySlowImage.current,
        boss: enemyBossImage.current,
      };
    }
    /* /LOAD SPRITES */

    if (!engine.waveGenerator?.isInitialized) {
      // init level map draw
      engine.map?.drawMap();
    }

    // game start
    if (engine.isGameStarted) {
      engine.animationFrameId = requestAnimationFrame(gameLoop);
      engine.requestIdleCallback = requestIdleCallback(gameLoopLogic, {
        timeout: engine.idleTimeout,
      });
    } else {
      cancelAnimationFrame(engine.animationFrameId);
      cancelIdleCallback(engine.requestIdleCallback);
    }
  }, [isGameStarted]);

  return (
    <section className="b-game" ref={gameWindow}>
      <div
        className="b-canvas-wrapper"
        style={{
          position: "relative",
          width: engine.map?.mapParams.width,
          height: engine.map?.mapParams.height,
        }}
      >
        <canvas
          ref={canvas}
          className="b-game-canvas"
          id="gameCanvas"
          width={engine.map?.mapParams.width}
          height={engine.map?.mapParams.height}
          style={{ position: "absolute", zIndex: 999 }}
          tabIndex={1}
        />
        <canvas
          ref={enemyCanvas}
          className="b-enemy-canvas"
          id="enemyCanvas"
          width={engine.map?.mapParams.width}
          height={engine.map?.mapParams.height}
          style={{ position: "absolute", zIndex: 99 }}
        />
        <canvas
          ref={mapCanvas}
          className="b-map-canvas"
          id="mapCanvas"
          width={engine.map?.mapParams.width}
          height={engine.map?.mapParams.height}
          style={{ position: "absolute", zIndex: 9 }}
        />
      </div>
      <div className="b-game-sprites">
        <div className="b-tower-sprite" style={{ display: "none" }}>
          <img
            id="towerOneImage"
            alt="towerOneImage sprite"
            src="towerOne.png"
            ref={towerOneImage}
          />
          <img
            id="towerTwoImage"
            alt="towerTwoImage sprite"
            src="towerTwo.png"
            ref={towerTwoImage}
          />
          <img
            id="towerThreeImage"
            alt="towerThreeImage sprite"
            src="towerThree.png"
            ref={towerThreeImage}
          />
        </div>
        <div className="b-enemy-sprite" style={{ display: "none" }}>
          <img
            id="enemyOneImage"
            alt="enemyOneImage sprite"
            src="enemyOne.png"
            ref={enemyOneImage}
          />
          <img
            id="enemyFastImage"
            alt="enemyFastImage sprite"
            src="enemyFast.png"
            ref={enemyFastImage}
          />
          <img
            id="enemySlowImage"
            alt="enemySlowImage sprite"
            src="enemySlow.png"
            ref={enemySlowImage}
          />
          <img
            id="enemyBossImage"
            alt="enemyBossImage sprite"
            src="enemyBoss.png"
            ref={enemyBossImage}
          />
        </div>
        <div className="b-projectile-sprite" style={{ display: "none" }}>
          <img
            id="projectileOneImage"
            alt="projectileOneImage sprite"
            src="projectileOne.png"
            ref={projectileOneImage}
          />
          <img
            id="projectileTwoImage"
            alt="projectileTwoImage sprite"
            src="projectileTwo.png"
            ref={projectileTwoImage}
          />
          <img
            id="projectileThreeImage"
            alt="projectileThreeImage sprite"
            src="projectileThree.png"
            ref={projectileThreeImage}
          />
        </div>
        <div className="b-projectile-hit-sprite" style={{ display: "none" }}>
          <img
            id="projectileHitOneImage"
            alt="projectileHitOneImage sprite"
            src="projectileHitOne.png"
            ref={projectileHitOneImage}
          />
          <img
            id="projectileHitTwoImage"
            alt="projectileHitTwoImage sprite"
            src="projectileHitTwo.png"
            ref={projectileHitTwoImage}
          />
          <img
            id="projectileHitThreeImage"
            alt="projectileHitThreeImage sprite"
            src="projectileHitThree.png"
            ref={projectileHitThreeImage}
          />
        </div>
      </div>
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
        <div>
          <button
            onClick={() => {
              engine.isGameStarted = true;
              setIsGameStarted(true);
            }}
          >
            Start
          </button>
          <button
            onClick={() => {
              engine.isGameStarted = false;
              setIsGameStarted(false);
            }}
          >
            Pause
          </button>
          <button
            onClick={() => {
              engine.restartGame();
              engine.isGameStarted = true;
              setIsGameStarted(true);
            }}
          >
            Restart
          </button>
        </div>
        <div>
          <button
            disabled={
              !engine.isEnoughMoney(engine.towerOneParam.towerParams.price)
            }
            onClick={() => {
              engine.buildFirstTower();
            }}
          >
            Build 1 level tower(${engine.towerOneParam.towerParams.price})
          </button>
          <button
            disabled={
              !engine.isEnoughMoney(engine.towerTwoParam.towerParams.price)
            }
            onClick={() => {
              engine.buildSecondTower();
            }}
          >
            Build 2 level tower(${engine.towerTwoParam.towerParams.price})
          </button>
          <button
            disabled={
              !engine.isEnoughMoney(engine.towerThreeParam.towerParams.price)
            }
            onClick={() => {
              engine.buildThirdTower();
            }}
          >
            Build 3 level tower(${engine.towerThreeParam.towerParams.price})
          </button>
        </div>
      </div>
    </section>
  );
};
