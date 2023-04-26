import { Enemy } from "@/pages/Game/enemies/Enemy";
import { TDEngine, TEnemyType } from "@/pages/Game/engine/TDEngine";
import { useGameStore as gameStore } from "@/store";

export type TWaveType = "regular" | "slow" | "fast" | "strong" | "boss";
export interface IWaveGenerator {
  waveParams: {
    currentWave: number;
    waveType: TWaveType;
    isWaveInProgress: boolean;
    hpCoefficient: number;
    speedCoefficient: number;
    enemyBountyCoefficient: number;
    enemyCountCoefficient: number;
    endWave: number;
    startWave: number;
    enemyCount: number;
  };
  waveTimerBetweenWaves: NodeJS.Timer | null;
  waveTimeoutBetweenWaves: number;
  waveCountdownTimer: NodeJS.Timer | null;
  waveCountdown: number;
}

export class WaveGenerator {
  constructor(
    public engine: TDEngine,
    public isInitialized: boolean = false,
    public waveParams: IWaveGenerator["waveParams"] = {
      currentWave: 1,
      waveType: "regular",
      isWaveInProgress: false,
      hpCoefficient: engine.initialGameParams.hpCoefficient,
      speedCoefficient: engine.initialGameParams.speedCoefficient,
      enemyBountyCoefficient: 1,
      enemyCountCoefficient: 5,
      endWave: engine.initialGameParams.endWave,
      startWave: 1,
      enemyCount: engine.initialGameParams.enemiesPerWave,
    },
    public waveTimerBetweenWaves: IWaveGenerator["waveTimerBetweenWaves"] = null,
    public waveTimeoutBetweenWaves: IWaveGenerator["waveTimeoutBetweenWaves"] = 5000, // 5000
    public waveCountdownTimer: IWaveGenerator["waveCountdownTimer"] = null,
    public waveCountdown: IWaveGenerator["waveCountdown"] = 0,
  ) {
    this.waveCountdown = Math.floor(this.waveTimeoutBetweenWaves / 1000);
  }

  public repeatEnemy = (times: number) => {
    const isBossWave = this.waveParams.waveType === "boss";
    let enemiesArray: Enemy[] = [];
    let speedCoefficient = 1;
    let hpCoefficient = this.engine.isDemo ? 5 : 1;
    let bounty = Math.floor(
      1 + this.waveParams.enemyBountyCoefficient * this.waveParams.currentWave,
    );
    switch (this.waveParams.waveType) {
      case "slow": {
        speedCoefficient *= 0.75;
        break;
      }
      case "fast": {
        speedCoefficient *= 1.25;
        break;
      }
      case "strong": {
        hpCoefficient *= 1.5;
        break;
      }
      default: {
        break;
      }
    }
    const speed =
      this.engine.initialGameParams.speedCoefficient *
        this.waveParams.currentWave *
        0.15 +
      this.waveParams.speedCoefficient * speedCoefficient;
    const hp =
      this.waveParams.hpCoefficient *
      this.waveParams.currentWave *
      hpCoefficient;

    if (isBossWave) {
      enemiesArray.push(
        new Enemy(this.engine, {
          type: "scorpion",
          width: this.engine.map?.mapParams?.gridStep!,
          height: this.engine.map?.mapParams?.gridStep!,
          spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
          speed: speed,
          bounty: 20 * this.waveParams.currentWave,
          hp: 10000 * this.waveParams.currentWave,
        }),
      );
    } else {
      // iterate enemies
      for (let iteration = 0; iteration < times; iteration++) {
        // stronger enemy
        if (iteration % 6 === 0) {
          enemiesArray.push(
            new Enemy(this.engine, {
              type: "firebug",
              width: this.engine.map?.mapParams?.gridStep!,
              height: this.engine.map?.mapParams?.gridStep!,
              spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
              speed: speed,
              bounty: bounty,
              hp: hp * 1.1,
            }),
          );
        } else if (iteration % 5 === 0) {
          enemiesArray.push(
            new Enemy(this.engine, {
              type: "butterfly",
              width: this.engine.map?.mapParams?.gridStep!,
              height: this.engine.map?.mapParams?.gridStep!,
              spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
              speed: speed,
              bounty: bounty,
              hp: hp * 1.1,
            }),
          );
        } else if (iteration % 4 === 0) {
          // slow enemy
          enemiesArray.push(
            new Enemy(this.engine, {
              type: "leafbug",
              width: this.engine.map?.mapParams?.gridStep!,
              height: this.engine.map?.mapParams?.gridStep!,
              spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
              speed: speed,
              bounty: bounty,
              hp: hp * 1.1,
            }),
          );
        } else if (iteration % 3 === 0) {
          // slow enemy
          enemiesArray.push(
            new Enemy(this.engine, {
              type: "clampbeetle",
              width: this.engine.map?.mapParams?.gridStep!,
              height: this.engine.map?.mapParams?.gridStep!,
              spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
              speed: speed * 0.9,
              bounty: bounty,
              hp: hp * 1.2,
            }),
          );
        } else if (iteration % 2 === 0) {
          // fast enemy
          enemiesArray.push(
            new Enemy(this.engine, {
              type: "firelocust",
              width: this.engine.map?.mapParams?.gridStep!,
              height: this.engine.map?.mapParams?.gridStep!,
              spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
              speed: speed * 1.1,
              bounty: bounty,
              hp: hp * 0.9,
            }),
          );
        } else {
          // regular enemy
          enemiesArray.push(
            new Enemy(this.engine, {
              type: `${
                Math.random() > 0.5 ? "firebug" : "magmacrab"
              }` as TEnemyType,
              width: this.engine.map?.mapParams?.gridStep!,
              height: this.engine.map?.mapParams?.gridStep!,
              spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
              speed: speed,
              bounty: bounty,
              hp: hp,
            }),
          );
        }
      }
    }
    gameStore.getState().updateEnemiesLeft(enemiesArray.length);
    return enemiesArray;
  };

  public init() {
    if (!this.isInitialized) {
      this.waveParams.currentWave = 1;
      // UI update
      gameStore.getState().updateWaveNumber(this.waveParams.currentWave);
      // fill enemies array
      this.engine.enemies = this.repeatEnemy(this.waveParams.enemyCount);

      // set enemies position
      this.engine.enemies?.forEach((enemy: Enemy, index: number) => {
        enemy.initialSetEnemy({
          x:
            -enemy.enemyParams.spaceBetweenEnemies! *
              this.engine.enemies?.length! +
            index * enemy.enemyParams.spaceBetweenEnemies!,
          y: 0,
        });
      });
      this.isInitialized = true;
      this.waveParams.isWaveInProgress = true;
      clearTimeout(this.waveTimerBetweenWaves!);
      this.waveTimerBetweenWaves = null;
    }
  }

  public setWaveType() {
    // set wave type
    switch (
      this.waveParams.currentWave +
      (this.waveParams.currentWave < this.waveParams.endWave ? 1 : 0)
    ) {
      case 2: {
        this.waveParams.waveType = "slow";
        break;
      }
      case 3: {
        this.waveParams.waveType = "fast";
        break;
      }
      case 4: {
        this.waveParams.waveType = "strong";
        break;
      }
      case 5: {
        this.waveParams.waveType = "boss";
        break;
      }
      case 6: {
        this.waveParams.waveType = "strong";
        break;
      }
      case 10: {
        this.waveParams.waveType = "boss";
        break;
      }
      default: {
        this.waveParams.waveType = "regular";
        break;
      }
    }
    gameStore.getState().updateWaveType(this.waveParams.waveType);
  }

  public spawnEnemies() {
    // fill enemies array
    if (this.waveParams.currentWave <= this.waveParams.endWave) {
      // increment wave
      this.waveParams.currentWave += 1;

      // UI update
      gameStore.getState().updateWaveNumber(this.waveParams.currentWave);

      // spawn into running wave
      if (this.waveParams.isWaveInProgress) {
        // create new Enemy class instances
        const enemiesSpawned = this.repeatEnemy(
          this.waveParams.enemyCount +
            this.waveParams.enemyCountCoefficient * this.waveParams.currentWave,
        );

        // push spawned enemies into common enemies pool
        if (this.engine.enemies?.length) {
          this.engine.enemies = this.engine.enemies?.concat(enemiesSpawned);
        }
        // set spawned enemies coordinates
        enemiesSpawned.forEach((enemy: Enemy, index: number) => {
          enemy.initialSetEnemy({
            x:
              -enemy.enemyParams.spaceBetweenEnemies! *
                this.engine.enemies?.length! +
              index * enemy.enemyParams.spaceBetweenEnemies!,
            y: 0,
          });
        });
        // spawn between waves
      } else {
        // fill enemies array
        this.engine.enemies = this.repeatEnemy(
          this.waveParams.waveType === "boss"
            ? 1
            : this.waveParams.enemyCount +
                this.waveParams.enemyCountCoefficient *
                  this.waveParams.currentWave,
        );
        // draw enemies
        this.engine.enemies?.forEach((enemy: Enemy, index: number) => {
          enemy.initialSetEnemy({
            x:
              -enemy.enemyParams.spaceBetweenEnemies! *
                this.engine.enemies?.length! +
              index * enemy.enemyParams.spaceBetweenEnemies!,
            y: 0,
          });
        });
      }

      clearTimeout(this.waveTimerBetweenWaves!);
      this.waveTimerBetweenWaves = null;
      this.waveParams.isWaveInProgress = true;
    }
  }

  public countdown() {
    if (!this.waveCountdownTimer) {
      this.waveCountdownTimer = setInterval(() => {
        if (this.waveCountdown > 0) {
          this.waveCountdown -= 1;
          // zustand store value update
          gameStore.getState().updateCountdown(this.waveCountdown);
        } else {
          clearInterval(this.waveCountdownTimer!);
          gameStore.getState().updateCountdown(0);
        }
      }, 1000);
    }
  }
}
