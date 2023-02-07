import Enemy from "../enemies/Enemy";
import Tower, { ITower } from "../towers/Tower";
import Map from "../maps/Map";
import Projectile from "../projectiles/Projectile";

// utilities declaration
type TPartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

// types declaration
type TTowerName = "levelOne" | "levelTwo" | "levelThree";
type TEnemyName =
  | "levelOne"
  | "levelTwo"
  | "levelThree"
  | "fast"
  | "slow"
  | "boss";
type TProjectileName =
  | "levelOne"
  | "levelTwo"
  | "levelThree"
  | "fast"
  | "slow"
  | "boss";
type TTowerSprite = TPartialRecord<TTowerName, TImageSprite | null>;
type TProjectileSprite = TPartialRecord<TProjectileName, TImageSprite | null>;
type TEnemySprite = TPartialRecord<TEnemyName, TImageSprite | null>;
type TImageSprite = CanvasImageSource;

/**
 * interfaces declaration
 */
export interface IWaveGenerator {
  waveParams: {
    currentWave: number;
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

class WaveGenerator {
  constructor(
    public engine: TDEngine,
    public isInitialized: boolean = false,
    public waveParams: IWaveGenerator["waveParams"] = {
      currentWave: 1,
      isWaveInProgress: false,
      hpCoefficient: engine.initialGameParams.hpCoefficient,
      speedCoefficient: engine.initialGameParams.speedCoefficient,
      enemyBountyCoefficient: 1,
      enemyCountCoefficient: 10,
      endWave: engine.initialGameParams.endWave,
      startWave: 1,
      enemyCount: engine.initialGameParams.enemiesPerWave,
    },
    public waveTimerBetweenWaves: IWaveGenerator["waveTimerBetweenWaves"] = null,
    public waveTimeoutBetweenWaves: IWaveGenerator["waveTimeoutBetweenWaves"] = 5000,
    public waveCountdownTimer: IWaveGenerator["waveCountdownTimer"] = null,
    public waveCountdown: IWaveGenerator["waveCountdown"] = 0,
    public isRunOnce = false,
  ) {
    this.waveCountdown = Math.floor(this.waveTimeoutBetweenWaves / 1000);
  }

  public countdown() {
    if (!this.waveCountdownTimer) {
      this.waveCountdownTimer = setInterval(() => {
        if (this.waveCountdown > 0) {
          this.waveCountdown -= 1;
        } else {
          clearInterval(this.waveCountdownTimer!);
          this.isRunOnce = false;
        }
      }, 1000);
    }
  }

  public repeatEnemy = (times: number) => {
    let enemiesArray = [];
    for (let iteration = 0; iteration < times; iteration++) {
      // boss enemy
      if (iteration === 10) {
        enemiesArray.push(
          new Enemy(this.engine, this.engine.enemySprites.boss!, {
            width: 25,
            height: 25,
            spaceBetweenEnemies: 10,
            speed:
              0.3 +
              this.waveParams.speedCoefficient * this.waveParams.currentWave,
            bounty:
              10 +
              this.waveParams.enemyBountyCoefficient *
                this.waveParams.currentWave,
            hp:
              1500 +
              this.waveParams.hpCoefficient * this.waveParams.currentWave,
          }),
        );
      } else if (iteration % 10 === 0) {
        // slow enemy
        enemiesArray.push(
          new Enemy(this.engine, this.engine.enemySprites.slow!, {
            width: 25,
            height: 25,
            spaceBetweenEnemies: 25,
            speed:
              0.4 +
              this.waveParams.speedCoefficient * this.waveParams.currentWave,
            bounty:
              3 +
              this.waveParams.enemyBountyCoefficient *
                this.waveParams.currentWave,
            hp:
              250 + this.waveParams.hpCoefficient * this.waveParams.currentWave,
          }),
        );
      } else if (iteration % 5 === 0) {
        // fast enemy
        enemiesArray.push(
          new Enemy(this.engine, this.engine.enemySprites.fast!, {
            width: 20,
            height: 20,
            spaceBetweenEnemies: 35,
            speed:
              1 +
              this.waveParams.speedCoefficient * this.waveParams.currentWave,
            bounty:
              3 +
              this.waveParams.enemyBountyCoefficient *
                this.waveParams.currentWave,
            hp:
              50 + this.waveParams.hpCoefficient * this.waveParams.currentWave,
          }),
        );
      } else {
        // regular enemy
        enemiesArray.push(
          new Enemy(this.engine, this.engine.enemySprites.levelOne!, {
            width: 20,
            height: 20,
            spaceBetweenEnemies: 35,
            speed:
              0.65 +
              this.waveParams.speedCoefficient * this.waveParams.currentWave,
            bounty:
              1 +
              this.waveParams.enemyBountyCoefficient *
                this.waveParams.currentWave,
            hp:
              100 + this.waveParams.hpCoefficient * this.waveParams.currentWave,
          }),
        );
      }
    }
    return enemiesArray;
  };

  public init() {
    if (!this.isInitialized) {
      // fill enemies array
      this.engine.enemies = this.repeatEnemy(
        this.waveParams.enemyCount +
          this.waveParams.enemyCountCoefficient * this.waveParams.currentWave,
      );
      // empty

      // draw enemies
      this.engine.enemies?.forEach((enemy: Enemy, index: number) => {
        enemy.drawEnemy({
          x:
            -enemy.enemyParams.spaceBetweenEnemies *
              this.engine.enemies?.length! +
            index * enemy.enemyParams.spaceBetweenEnemies,
          y: 0,
        });
      });
      this.isInitialized = true;
      this.waveParams.currentWave = 1;
      this.waveParams.isWaveInProgress = true;
      // wave timers
      this.waveTimerBetweenWaves = null;
      this.waveCountdownTimer = null;
    }
  }

  public spawnEnemies() {
    // fill enemies array
    if (
      this.waveParams.currentWave < this.waveParams.endWave &&
      !this.waveParams.isWaveInProgress
    ) {
      // increment wave
      this.waveParams.currentWave += 1;

      this.engine.enemies = this.repeatEnemy(
        this.waveParams.enemyCount +
          this.waveParams.enemyCountCoefficient * this.waveParams.currentWave,
      );
      // wave timers
      //clearInterval(this.waveCountdownTimer!);
    }

    // draw enemies
    this.engine.enemies?.forEach((enemy: Enemy, index: number) => {
      enemy.drawEnemy({
        x:
          -enemy.enemyParams.spaceBetweenEnemies *
            this.engine.enemies?.length! +
          index * enemy.enemyParams.spaceBetweenEnemies,
        y: 0,
      });
    });

    // increment wave
    this.waveTimerBetweenWaves = null;
    this.waveParams.isWaveInProgress = true;
  }
}

export interface ITwoDCoordinates {
  x: number;
  y: number;
}

export interface ITDEngine {
  context?: CanvasRenderingContext2D;
  mapContext?: CanvasRenderingContext2D;
  enemyContext?: CanvasRenderingContext2D;
  enemies?: Enemy[];
  towers?: Tower[];
  projectiles?: Projectile[];
  map?: Map;
  animationFrameId: number;
  requestIdleCallback: number;
  twoDCoordinates: ITwoDCoordinates;
  lives: number;
  score: number;
  money: number;
  idleTimeout: number;
  isCanBuild: boolean;
  isGameStarted: boolean;
  isShowGrid: boolean;
  isNotEnoughMoney: boolean;
  canvasMouseMoveEvent: EventListener | null;
  draftTower: Tower | null;
  cursorPosition: ITwoDCoordinates;
  towerSprites: TTowerSprite;
  projectileSprites: TProjectileSprite;
  projectileHitSprites: TProjectileSprite;
  enemySprites: TEnemySprite;
  mapSprites: TImageSprite[];
  predefinedTowerParams: {
    levelOne: {
      towerParams: ITower["towerParams"];
      projectileParams: ITower["projectileParams"];
    };
    levelTwo: {
      towerParams: ITower["towerParams"];
      projectileParams: ITower["projectileParams"];
    };
    levelThree: {
      towerParams: ITower["towerParams"];
      projectileParams: ITower["projectileParams"];
    };
  };
  initialGameParams: {
    money: number;
    lives: number;
    wave: number;
    enemiesPerWave: number;
    endWave: number;
    hpCoefficient: number;
    speedCoefficient: number;
    strokeStyle: string;
  };
  waveGenerator: WaveGenerator | null;
}

class TDEngine {
  constructor(
    public context?: ITDEngine["context"],
    public mapContext?: ITDEngine["context"],
    public enemyContext?: ITDEngine["context"],
    public map?: ITDEngine["map"],
    public enemies: ITDEngine["enemies"] = [],
    public towers: ITDEngine["towers"] = [],
    public projectiles: ITDEngine["projectiles"] = [],
    public idleTimeout: ITDEngine["idleTimeout"] = 250,
    public animationFrameId: ITDEngine["animationFrameId"] = 0,
    public requestIdleCallback: ITDEngine["requestIdleCallback"] = 0,
    public lives: ITDEngine["lives"] = 0,
    public score: ITDEngine["score"] = 0,
    public money: ITDEngine["money"] = 0,
    public isCanBuild: ITDEngine["isCanBuild"] = false,
    public isGameStarted: ITDEngine["isGameStarted"] = false,
    public isShowGrid: ITDEngine["isShowGrid"] = false,
    public isNotEnoughMoney: ITDEngine["isNotEnoughMoney"] = false,
    public draftTower: ITDEngine["draftTower"] = null,
    public cursorPosition: ITDEngine["cursorPosition"] = { x: 0, y: 0 },
    public draftBuildCoordinates: ITwoDCoordinates = { x: 0, y: 0 },
    public towerSprites: ITDEngine["towerSprites"] = {},
    public enemySprites: ITDEngine["enemySprites"] = {},
    public projectileSprites: ITDEngine["projectileSprites"] = {},
    public projectileHitSprites: ITDEngine["projectileHitSprites"] = {},
    public mapSprites: ITDEngine["mapSprites"] = [],
    public predefinedTowerParams: ITDEngine["predefinedTowerParams"] = {
      levelOne: {
        towerParams: {
          attackRate: 1000,
          attackDamage: 30,
          attackRange: 120,
          width: 30,
          height: 30,
          rectCenterX: 0,
          rectCenterY: 0,
          strokeStyle: "green",
          firingAngle: 0,
          firingX: 0,
          firingY: 0,
          price: 25,
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 0.2,
          targetX: 0,
          targetY: 0,
          rectCenterX: 0,
          rectCenterY: 0,
          width: 6,
          height: 6,
          projectileHitAlive: 80,
        },
      },
      levelTwo: {
        towerParams: {
          attackRate: 300,
          attackDamage: 20,
          attackRange: 60,
          width: 30,
          height: 30,
          rectCenterX: 0,
          rectCenterY: 0,
          strokeStyle: "green",
          firingAngle: 0,
          firingX: 0,
          firingY: 0,
          price: 45,
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 0.4,
          targetX: 0,
          targetY: 0,
          rectCenterX: 0,
          rectCenterY: 0,
          width: 6,
          height: 6,
          projectileHitAlive: 80,
        },
      },
      levelThree: {
        towerParams: {
          attackRate: 4000,
          attackDamage: 100,
          attackRange: 250,
          width: 30,
          height: 30,
          rectCenterX: 0,
          rectCenterY: 0,
          strokeStyle: "green",
          firingAngle: 0,
          firingX: 0,
          firingY: 0,
          price: 65,
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 0.25,
          targetX: 0,
          targetY: 0,
          rectCenterX: 0,
          rectCenterY: 0,
          width: 6,
          height: 6,
          projectileHitAlive: 80,
        },
      },
    },
    public initialGameParams: ITDEngine["initialGameParams"] = {
      money: 100,
      lives: 10,
      wave: 1,
      enemiesPerWave: 20,
      endWave: 10,
      hpCoefficient: 20,
      speedCoefficient: 0.1,
      strokeStyle: "#000000",
    },
    public waveGenerator: ITDEngine["waveGenerator"] = null,
  ) {
    this.setMap(new Map(this));
    this.waveGenerator = new WaveGenerator(this);
    this.money = this.initialGameParams.money;
    this.lives = this.initialGameParams.lives;
  }

  public restartGame() {
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    // create mapTilesArr
    this.map?.createMapTilesArr();
    // pop tiles which is occupied by map path
    this.map?.popMapPathTiles();
    // game params
    this.money = this.initialGameParams.money;
    this.lives = this.initialGameParams.lives;
    this.score = 0;
    // spawner
    if (this.waveGenerator!.waveTimerBetweenWaves) {
      clearInterval(this.waveGenerator!.waveTimerBetweenWaves!);
    }
    this.waveGenerator!.waveCountdown = Math.floor(
      this.waveGenerator!.waveTimeoutBetweenWaves / 1000,
    );
    this.waveGenerator!.isInitialized = false;
  }

  public clearMemory() {
    this.enemies = [];
    this.projectiles = [];
    for (let tower of this.towers!) {
      tower.target = null;
    }
  }

  public manageHotkeys(e: KeyboardEvent) {
    // cancel building mode
    if (e.key === "Escape") {
      if (this.isCanBuild) {
        this.isCanBuild = false;
        this.isShowGrid = false;
      }
    }

    if (e.key === "1") {
      if (!this.isCanBuild) {
        this.buildFirstTower();
      }
    }
    if (e.key === "2") {
      if (!this.isCanBuild) {
        this.buildSecondTower();
      }
    }
    if (e.key === "3") {
      if (!this.isCanBuild) {
        this.buildThirdTower();
      }
    }
    if (e.key === "4") {
      // release all tower target
      for (const tower of this.towers!) {
        tower.target = null;
      }
    }
    if (e.key === "5") {
      // remove all projectiles
      this.projectiles = [];
    }
    // log mode
    if (e.key === "0") {
      // debug
      console.log("this.enemies");
      console.log(this.enemies);
      console.log(this.enemies?.length);
      console.log("----");
      console.log(`this.towers`);
      console.log(this.towers);
      console.log(this.towers?.length);
      console.log("----");
      console.log(`this.projectiles`);
      console.log(this.projectiles);
      console.log(this.projectiles?.length);
      console.log("---");
      console.log(`this.lives`);
      console.log(this.lives);
      console.log(`this.money`);
      console.log(this.money);
      console.log("---");
      console.log(`this.waveGenerator.waveParams`);
      console.log(this.waveGenerator?.waveParams);
      console.log("---");
      //
    }
  }

  public buildFirstTower = () => {
    this.isCanBuild = true;
    this.draftTower = new Tower(
      this,
      this.towerSprites.levelOne!,
      this.projectileSprites.levelOne!,
      this.projectileHitSprites.levelOne!,
      this.draftBuildCoordinates,
      this.towerOneParam.towerParams,
      this.towerOneParam.projectileParams,
    );
  };

  public buildSecondTower = () => {
    this.isCanBuild = true;
    this.draftTower = new Tower(
      this,
      this.towerSprites.levelTwo!,
      this.projectileSprites.levelTwo!,
      this.projectileHitSprites.levelTwo!,
      this.draftBuildCoordinates,
      this.towerTwoParam.towerParams,
      this.towerTwoParam.projectileParams,
    );
  };

  public buildThirdTower = () => {
    this.isCanBuild = true;
    this.draftTower = new Tower(
      this,
      this.towerSprites.levelThree!,
      this.projectileSprites.levelThree!,
      this.projectileHitSprites.levelThree!,
      this.draftBuildCoordinates,
      this.towerThreeParam.towerParams,
      this.towerThreeParam.projectileParams,
    );
  };

  public findClosestTile(coordinates: ITwoDCoordinates) {
    let minDistance = this.map?.mapParams.width;
    for (let tile of this.map?.mapParams.mapTilesArr!) {
      const distance =
        (tile.x -
          coordinates.x! +
          this.map?.mapParams.gridStep! -
          this.map?.mapParams?.tileCenter!) *
          (tile.x -
            coordinates.x! +
            this.map?.mapParams.gridStep! -
            this.map?.mapParams?.tileCenter!) +
        (tile.y -
          coordinates.y! +
          this.map?.mapParams.gridStep! +
          this.map?.mapParams?.tileCenter!) *
          (tile.y -
            coordinates.y! +
            this.map?.mapParams.gridStep! +
            this.map?.mapParams?.tileCenter!);
      if (distance < minDistance!) {
        minDistance = distance;
        this.map!.mapParams.closestTile! = tile!;
      }
    }

    this.draftBuildCoordinates = {
      x: this.map?.mapParams.closestTile.x! + this.map?.mapParams.gridStep!,
      y: this.map?.mapParams.closestTile.y! + this.map?.mapParams.gridStep!,
    };

    return {
      x: this.map?.mapParams.closestTile.x,
      y: this.map?.mapParams.closestTile.y!,
    };
  }

  highlightTile(coords: ITwoDCoordinates) {
    this.context?.beginPath();
    this.context!.strokeStyle = "green";
    this.context?.setLineDash([]);
    this.context?.strokeRect(
      coords.x,
      coords.y,
      this.map?.mapParams.gridStep!,
      this.map?.mapParams.gridStep!,
    );
    this.context?.closePath();
  }

  public canvasMouseMoveCallback = (e: MouseEvent) => {
    this.cursorPosition = { x: e.pageX, y: e.pageY };
    this.findClosestTile(this.cursorPosition);
    this.draftShowTower();
  };

  public canvasClickCallback = (e: MouseEvent) => {
    this.draftBuildTower();
  };

  public gameWindowKeydown = (e: KeyboardEvent) => {
    this.manageHotkeys(e);
  };

  public draftShowTower() {
    if (this.isCanBuild) {
      // show building grid
      // this.isShowGrid = true

      if (!this.draftTower) {
        this.draftTower = new Tower(
          this,
          undefined,
          undefined,
          undefined,
          this.draftBuildCoordinates,
        );
      } else {
        this.draftTower.currentPosition = this.draftBuildCoordinates;
      }

      this.draftTower.towerParams.strokeStyle = "green";
    }
  }

  public draftBuildTower() {
    if (this.isCanBuild) {
      if (this.money >= this.draftTower?.towerParams.price!) {
        this.isNotEnoughMoney = false;

        let isTileFound = false;
        for (const tile of this.map?.mapParams.mapTilesArr!) {
          if (
            tile.x === this.map?.mapParams.closestTile.x &&
            tile.y === this.map?.mapParams.closestTile.y
          ) {
            isTileFound = true;
          }
        }

        if (isTileFound) {
          // show building grid
          // this.isShowGrid = true

          if (!this.draftTower) {
            this.draftTower = new Tower(
              this,
              undefined,
              undefined,
              undefined,
              this.draftBuildCoordinates,
            );
          } else {
            this.draftTower.currentPosition = this.draftBuildCoordinates;
          }

          // set strokeStyle to default
          this.draftTower.towerParams.strokeStyle =
            this.initialGameParams.strokeStyle;

          // add new tower
          this.towers = [...this.towers!, this.draftTower];

          // enable attack timer
          this.draftTower.setAttackInterval();

          // pop chosen tile from available space to build
          this.map!.mapParams.mapTilesArr! =
            this.map?.mapParams.mapTilesArr.filter((tile) => {
              return (
                tile.x !== this.map?.mapParams.closestTile.x ||
                tile.y !== this.map?.mapParams.closestTile.y
              );
            })!;
          // disable building mode
          this.isCanBuild = false;
          this.money -= this.draftTower.towerParams.price!;
          this.draftTower = null;
          // this.map.mapParams.closestTile = this.findClosestTile(this.cursorPosition)
        }
      } else {
        this.isNotEnoughMoney = true;
      }
    }
  }

  public clearCanvas() {
    // clear game canvas
    this.context?.clearRect(
      0,
      0,
      this.map?.mapParams.width!,
      this.map?.mapParams.height!,
    );
    // clear enemy canvas
    this.enemyContext?.clearRect(
      0,
      0,
      this.map?.mapParams.width!,
      this.map?.mapParams.height!,
    );
  }

  public setContext(context: ITDEngine["context"]) {
    this.context = context;
  }

  public setMapContext(mapContext: ITDEngine["context"]) {
    this.mapContext = mapContext;
  }

  public setEnemyContext(enemyContext: ITDEngine["context"]) {
    this.enemyContext = enemyContext;
  }

  public setMap(map: ITDEngine["map"]) {
    this.map = map;
  }

  public setEnemies(enemies: ITDEngine["enemies"]) {
    this.enemies = enemies;
  }

  public setTowers(towers: ITDEngine["towers"]) {
    this.towers = towers;
  }

  public setProjectiles(projectiles: ITDEngine["projectiles"]) {
    this.projectiles = projectiles;
  }

  public pushProjectile(projectile: Projectile) {
    this.projectiles?.push(projectile);
  }

  public get towerOneParam() {
    return structuredClone(this.predefinedTowerParams.levelOne);
  }

  public get towerTwoParam() {
    return structuredClone(this.predefinedTowerParams.levelTwo);
  }

  public get towerThreeParam() {
    return structuredClone(this.predefinedTowerParams.levelThree);
  }
}

export default TDEngine;
