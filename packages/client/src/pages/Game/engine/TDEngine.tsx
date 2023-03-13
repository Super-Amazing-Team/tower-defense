import Enemy from "../enemies/Enemy";
import Tower from "../towers/Tower";
import Map from "../maps/Map";
import Projectile from "../projectiles/Projectile";
import Sound from "@/pages/Game/sound/Sound";

// utilities declaration
export type TPartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

// types declaration
export type TEngineCanvas =
  | "build"
  | "projectile"
  | "constructing"
  | "selection"
  | "hpBar"
  | "game"
  | "cannon"
  | "tower"
  | "enemy"
  | "deadEnemy"
  | "map";
export type TTowerSpriteTypes =
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six";
export type TEnemyType =
  | "firebug"
  | "leafbug"
  | "scorpion"
  | "firewasp"
  | "clampbeetle"
  | "firelocust";
type TTowerSprite = TPartialRecord<TTowerSpriteTypes, ITowerSprite | null>;
export type TTowerSpriteElements =
  | "base"
  | "construction"
  | "constructionEnd"
  | "impact"
  | "weapon"
  | "projectile";
type TEnemySprite = TPartialRecord<TEnemyType, IEnemySprite | null>;
export type TEnemySpriteDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "start"
  | "end"
  | "startDead"
  | "endDead"
  | "leftDead"
  | "rightDead"
  | "upDead"
  | "downDead";
type TImageSprite = CanvasImageSource;

/**
 * interfaces declaration
 */
interface ITowerSprite {
  spriteSourcePath?: Record<TTowerSpriteElements, string | string[]>;
  spriteSource: TPartialRecord<
    TTowerSpriteElements,
    HTMLImageElement | HTMLImageElement[]
  > | null;
  canvasArr: Record<
    TTowerSpriteElements,
    HTMLCanvasElement[] | HTMLCanvasElement[][]
  > | null;
  canvasContextArr: Record<
    TTowerSpriteElements,
    CanvasRenderingContext2D[] | CanvasRenderingContext2D[][]
  > | null;
}
interface IEnemySprite {
  spriteSourcePath?: string;
  spriteSource: HTMLImageElement | null;
  canvasArr: TPartialRecord<TEnemySpriteDirection, HTMLCanvasElement[]> | null;
  canvasContextArr: TPartialRecord<
    TEnemySpriteDirection,
    CanvasRenderingContext2D[]
  > | null;
  framesPerSprite: number;
  deathFramesPerSprite: number;
  spriteRightRow: number;
  spriteLeftRow: number;
  spriteUpRow: number;
  spriteDownRow: number;
}

export interface ITwoDCoordinates {
  x: number;
  y: number;
}
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
      enemyCountCoefficient: 5,
      endWave: engine.initialGameParams.endWave,
      startWave: 1,
      enemyCount: engine.initialGameParams.enemiesPerWave,
    },
    public waveTimerBetweenWaves: IWaveGenerator["waveTimerBetweenWaves"] = null,
    public waveTimeoutBetweenWaves: IWaveGenerator["waveTimeoutBetweenWaves"] = 5000, // 5000
    public waveCountdownTimer: IWaveGenerator["waveCountdownTimer"] = null,
    public waveCountdown: IWaveGenerator["waveCountdown"] = 0,
    public isUICountdown = false,
  ) {
    this.waveCountdown = Math.floor(this.waveTimeoutBetweenWaves / 1000);
  }

  public repeatEnemy = (times: number) => {
    let enemiesArray = [];
    for (let iteration = 0; iteration < times; iteration++) {
      // boss enemy
      if (iteration % 6 === 0) {
        enemiesArray.push(
          new Enemy(this.engine, {
            type: "firebug",
            width: this.engine.map?.mapParams?.gridStep!,
            height: this.engine.map?.mapParams?.gridStep!,
            spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
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
      } else if (iteration % 5 === 0) {
        enemiesArray.push(
          new Enemy(this.engine, {
            type: "scorpion",
            width: this.engine.map?.mapParams?.gridStep!,
            height: this.engine.map?.mapParams?.gridStep!,
            spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
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
      } else if (iteration % 4 === 0) {
        // slow enemy
        enemiesArray.push(
          new Enemy(this.engine, {
            type: "leafbug",
            width: this.engine.map?.mapParams?.gridStep!,
            height: this.engine.map?.mapParams?.gridStep!,
            spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
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
      } else if (iteration % 3 === 0) {
        // slow enemy
        enemiesArray.push(
          new Enemy(this.engine, {
            type: "clampbeetle",
            width: this.engine.map?.mapParams?.gridStep!,
            height: this.engine.map?.mapParams?.gridStep!,
            spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
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
      } else if (iteration % 2 === 0) {
        // fast enemy
        enemiesArray.push(
          new Enemy(this.engine, {
            type: "firelocust",
            width: this.engine.map?.mapParams?.gridStep!,
            height: this.engine.map?.mapParams?.gridStep!,
            spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
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
      } else {
        // regular enemy
        enemiesArray.push(
          new Enemy(this.engine, {
            type: "firebug",
            width: this.engine.map?.mapParams?.gridStep!,
            height: this.engine.map?.mapParams?.gridStep!,
            spaceBetweenEnemies: this.engine.map?.mapParams?.gridStep! * 1.5,
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
      this.waveParams.currentWave = 1;
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

  public spawnEnemies() {
    // fill enemies array
    if (this.waveParams.currentWave < this.waveParams.endWave) {
      // increment wave
      this.waveParams.currentWave += 1;

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
          this.waveParams.enemyCount +
            this.waveParams.enemyCountCoefficient * this.waveParams.currentWave,
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
        } else {
          clearInterval(this.waveCountdownTimer!);
          this.isUICountdown = false;
        }
      }, 1000);
    }
  }
}

export interface ITDEngine {
  context?: TPartialRecord<TEngineCanvas, CanvasRenderingContext2D>;
  gameWindow?: HTMLElement | null;
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
  isInitialized: boolean;
  isCanBuild: boolean;
  isGameStarted: boolean;
  isGameOver: boolean;
  isShowGrid: boolean;
  isNotEnoughMoney: boolean;
  canvasMouseMoveEvent: EventListener | null;
  draftTower: Tower | null;
  selectedTower: Tower | null;
  cursorPosition: ITwoDCoordinates;
  towerSprites: TTowerSprite;
  enemySprites: TEnemySprite;
  mapSprites: TImageSprite[];
  predefinedTowerParams: TPartialRecord<
    TTowerSpriteTypes,
    {
      towerParams: Tower["towerParams"];
      projectileParams: Tower["projectileParams"];
    }
  >;
  initialGameParams: {
    money: number;
    lives: number;
    wave: number;
    enemiesPerWave: number;
    endWave: number;
    hpCoefficient: number;
    speedCoefficient: number;
    strokeStyle: string;
    framesPerSprite: number;
    fps: number;
  };
  waveGenerator: WaveGenerator | null;
  sound: Sound | null;
}

export class TDEngine {
  constructor(
    public map?: ITDEngine["map"],
    public enemies: ITDEngine["enemies"] = [],
    public deadEnemies: ITDEngine["enemies"] = [],
    public towers: ITDEngine["towers"] = [],
    public projectiles: ITDEngine["projectiles"] = [],
    public context: ITDEngine["context"] = {},
    public gameWindow: ITDEngine["gameWindow"] = null,
    public animationFrameId: ITDEngine["animationFrameId"] = 0,
    public requestIdleCallback: ITDEngine["requestIdleCallback"] = 0,
    public UICallback: () => void = () => {},
    public lives: ITDEngine["lives"] = 0,
    public score: ITDEngine["score"] = 0,
    public money: ITDEngine["money"] = 0,
    public canvasZIndex: Record<TEngineCanvas, number> = {
      build: 99,
      projectile: 94,
      constructing: 83,
      selection: 79,
      hpBar: 69,
      game: 59,
      cannon: 49,
      tower: 39,
      enemy: 29,
      deadEnemy: 19,
      map: 9,
    } as const,
    public isInitialized: ITDEngine["isInitialized"] = false,
    public isCanBuild: ITDEngine["isCanBuild"] = false,
    public isGameStarted: ITDEngine["isGameStarted"] = false,
    public isGameOver: ITDEngine["isGameOver"] = false,
    public isShowGrid: ITDEngine["isShowGrid"] = false,
    public isNotEnoughMoney: ITDEngine["isNotEnoughMoney"] = false,
    public draftTower: ITDEngine["draftTower"] = null,
    public selectedTower: ITDEngine["selectedTower"] = null,
    public cursorPosition: ITDEngine["cursorPosition"] = { x: 0, y: 0 },
    public draftBuildCoordinates: ITwoDCoordinates = { x: 0, y: 0 },
    public towerSprites: ITDEngine["towerSprites"] = {
      one: {
        spriteSourcePath: {
          base: "towerOneBase.png",
          construction: [
            "constructionLevelOne.png",
            "constructionLevelTwo.png",
            "constructionLevelThree.png",
          ],
          constructionEnd: [
            "constructionEndLevelOne.png",
            "constructionEndLevelTwo.png",
            "constructionEndLevelThree.png",
          ],
          impact: [
            "towerOneLevelOneImpact.png",
            "towerOneLevelTwoImpact.png",
            "towerOneLevelThreeImpact.png",
          ],
          weapon: [
            "towerOneLevelOneWeapon.png",
            "towerOneLevelTwoWeapon.png",
            "towerOneLevelThreeWeapon.png",
          ],
          projectile: [
            "towerOneLevelOneProjectile.png",
            "towerOneLevelTwoProjectile.png",
            "towerOneLevelThreeProjectile.png",
          ],
        },
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      two: {
        spriteSourcePath: {
          base: "towerTwoBase.png",
          construction: [
            "constructionLevelOne.png",
            "constructionLevelTwo.png",
            "constructionLevelThree.png",
          ],
          constructionEnd: [
            "constructionEndLevelOne.png",
            "constructionEndLevelTwo.png",
            "constructionEndLevelThree.png",
          ],
          impact: [
            "towerTwoLevelOneImpact.png",
            "towerTwoLevelTwoImpact.png",
            "towerTwoLevelThreeImpact.png",
          ],
          weapon: [
            "towerTwoLevelOneWeapon.png",
            "towerTwoLevelTwoWeapon.png",
            "towerTwoLevelThreeWeapon.png",
          ],
          projectile: [
            "towerTwoLevelOneProjectile.png",
            "towerTwoLevelTwoProjectile.png",
            "towerTwoLevelThreeProjectile.png",
          ],
        },
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      three: {
        spriteSourcePath: {
          base: "towerThreeBase.png",
          construction: [
            "constructionLevelOne.png",
            "constructionLevelTwo.png",
            "constructionLevelThree.png",
          ],
          constructionEnd: [
            "constructionEndLevelOne.png",
            "constructionEndLevelTwo.png",
            "constructionEndLevelThree.png",
          ],
          impact: [
            "towerThreeLevelOneImpact.png",
            "towerThreeLevelTwoImpact.png",
            "towerThreeLevelThreeImpact.png",
          ],
          weapon: [
            "towerThreeLevelOneWeapon.png",
            "towerThreeLevelTwoWeapon.png",
            "towerThreeLevelThreeWeapon.png",
          ],
          projectile: [
            "towerThreeLevelOneProjectile.png",
            "towerThreeLevelTwoProjectile.png",
            "towerThreeLevelThreeProjectile.png",
          ],
        },
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      four: {
        spriteSourcePath: {
          base: "towerFourBase.png",
          construction: [
            "constructionLevelOne.png",
            "constructionLevelTwo.png",
            "constructionLevelThree.png",
          ],
          constructionEnd: [
            "constructionEndLevelOne.png",
            "constructionEndLevelTwo.png",
            "constructionEndLevelThree.png",
          ],
          impact: [
            "towerFourLevelOneImpact.png",
            "towerFourLevelTwoImpact.png",
            "towerFourLevelThreeImpact.png",
          ],
          weapon: [
            "towerFourLevelOneWeapon.png",
            "towerFourLevelTwoWeapon.png",
            "towerFourLevelThreeWeapon.png",
          ],
          projectile: [
            "towerFourLevelOneProjectile.png",
            "towerFourLevelTwoProjectile.png",
            "towerFourLevelThreeProjectile.png",
          ],
        },
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
    },
    public isTowerSpritesLoaded = false,
    public isEnemySpritesLoaded = false,
    public enemySprites: ITDEngine["enemySprites"] = {
      firebug: {
        spriteSourcePath: "firebugSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteRightRow: 5,
        spriteLeftRow: 6,
        spriteUpRow: 4,
        spriteDownRow: 3,
        framesPerSprite: 8,
        deathFramesPerSprite: 11,
      },
      leafbug: {
        spriteSourcePath: "leafbugSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteRightRow: 5,
        spriteLeftRow: 6,
        spriteUpRow: 3,
        spriteDownRow: 4,
        framesPerSprite: 8,
        deathFramesPerSprite: 8,
      },
      clampbeetle: {
        spriteSourcePath: "clampbeetleSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteDownRow: 3,
        spriteUpRow: 4,
        spriteLeftRow: 5,
        spriteRightRow: 6,
        framesPerSprite: 8,
        deathFramesPerSprite: 13,
      },
      scorpion: {
        spriteSourcePath: "scorpionSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteDownRow: 3,
        spriteUpRow: 4,
        spriteLeftRow: 5,
        spriteRightRow: 6,
        framesPerSprite: 8,
        deathFramesPerSprite: 8,
      },
      firelocust: {
        spriteSourcePath: "firelocustSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteRightRow: 6,
        spriteLeftRow: 7,
        spriteUpRow: 5,
        spriteDownRow: 4,
        framesPerSprite: 12,
        deathFramesPerSprite: 14,
      },
      firewasp: {
        spriteSourcePath: "firewaspSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteRightRow: 6,
        spriteLeftRow: 7,
        spriteUpRow: 7,
        spriteDownRow: 7,
        framesPerSprite: 8,
        deathFramesPerSprite: 11,
      },
    },
    public mapSprites: ITDEngine["mapSprites"] = [],
    public predefinedTowerParams: ITDEngine["predefinedTowerParams"] = {
      one: {
        towerParams: {
          attackRate: 2000,
          attackDamage: 30,
          attackRange: 300,
          baseWidth: 64,
          baseHeight: 128,
          constructionWidth: 192,
          constructionHeight: 256,
          constructionFrameLimit: 6,
          dimensions: [
            {
              cannonWidth: 96,
              cannonHeight: 96,
              cannonOffsetX: 0,
              cannonOffsetY: 20,
            },
            {
              cannonWidth: 96,
              cannonHeight: 96,
              cannonOffsetX: 0,
              cannonOffsetY: 12,
            },
            {
              cannonWidth: 96,
              cannonHeight: 96,
              cannonOffsetX: 0,
              cannonOffsetY: 4,
            },
          ],
          cannonFrameLimit: 6,
          isSelected: false,
          firingAngle: 0,
          fireFromCoords: { x: 0, y: 0 },
          strokeStyle: "green",
          maxUpgradeLevel: 3,
          price: 25,
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 0.2,
          rectCenterX: 0,
          rectCenterY: 0,
          dimensions: [
            {
              projectileWidth: 22,
              projectileHeight: 40,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 22,
              projectileHeight: 40,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 22,
              projectileHeight: 40,
              impactWidth: 64,
              impactHeight: 64,
            },
          ],
          projectileFrameLimit: 3,
          impactFrameLimit: 6,
        },
      },
      two: {
        towerParams: {
          attackRate: 3000,
          attackDamage: 20,
          attackRange: 300,
          baseWidth: 64,
          baseHeight: 128,
          constructionWidth: 192,
          constructionHeight: 256,
          constructionFrameLimit: 6,
          dimensions: [
            {
              cannonWidth: 48,
              cannonHeight: 48,
              cannonOffsetX: 0,
              cannonOffsetY: 22,
            },
            {
              cannonWidth: 64,
              cannonHeight: 64,
              cannonOffsetX: 0,
              cannonOffsetY: 12,
            },
            {
              cannonWidth: 64,
              cannonHeight: 64,
              cannonOffsetX: 0,
              cannonOffsetY: 4,
            },
          ],
          cannonFrameLimit: 16,
          strokeStyle: "green",
          firingAngle: 0,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 3,
          price: 45,
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 0.4,
          rectCenterX: 0,
          rectCenterY: 0,
          dimensions: [
            {
              projectileWidth: 32,
              projectileHeight: 32,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 32,
              projectileHeight: 32,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 32,
              projectileHeight: 32,
              impactWidth: 64,
              impactHeight: 64,
            },
          ],
          projectileFrameLimit: 5,
          impactFrameLimit: 5,
        },
      },
      three: {
        towerParams: {
          attackRate: 3000,
          attackDamage: 20,
          attackRange: 300,
          baseWidth: 64,
          baseHeight: 128,
          constructionWidth: 192,
          constructionHeight: 256,
          constructionFrameLimit: 6,
          dimensions: [
            {
              cannonWidth: 96,
              cannonHeight: 96,
              cannonOffsetX: 0,
              cannonOffsetY: 22,
            },
            {
              cannonWidth: 96,
              cannonHeight: 96,
              cannonOffsetX: 0,
              cannonOffsetY: 12,
            },
            {
              cannonWidth: 96,
              cannonHeight: 96,
              cannonOffsetX: 0,
              cannonOffsetY: 4,
            },
          ],
          cannonFrameLimit: 8,
          strokeStyle: "green",
          firingAngle: 0,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 3,
          price: 45,
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 0.4,
          dimensions: [
            {
              projectileWidth: 10,
              projectileHeight: 10,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 10,
              projectileHeight: 10,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 10,
              projectileHeight: 10,
              impactWidth: 64,
              impactHeight: 64,
            },
          ],
          projectileFrameLimit: 6,
          impactFrameLimit: 5,
        },
      },
      four: {
        towerParams: {
          attackRate: 3000,
          attackDamage: 20,
          attackRange: 300,
          baseWidth: 64,
          baseHeight: 128,
          constructionWidth: 192,
          constructionHeight: 256,
          constructionFrameLimit: 6,
          dimensions: [
            {
              cannonWidth: 128,
              cannonHeight: 128,
              cannonOffsetX: 0,
              cannonOffsetY: 22,
            },
            {
              cannonWidth: 128,
              cannonHeight: 128,
              cannonOffsetX: 0,
              cannonOffsetY: 12,
            },
            {
              cannonWidth: 128,
              cannonHeight: 128,
              cannonOffsetX: 0,
              cannonOffsetY: 4,
            },
          ],
          cannonFrameLimit: 16,
          strokeStyle: "green",
          firingAngle: 0,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 3,
          price: 45,
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 0.4,
          dimensions: [
            {
              projectileWidth: 8,
              projectileHeight: 8,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 8,
              projectileHeight: 8,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 8,
              projectileHeight: 8,
              impactWidth: 64,
              impactHeight: 64,
            },
          ],
          projectileFrameLimit: 6,
          impactFrameLimit: 8,
        },
      },
    },
    public initialGameParams: ITDEngine["initialGameParams"] = {
      money: 1000,
      lives: 10,
      wave: 1,
      enemiesPerWave: 20,
      endWave: 10,
      hpCoefficient: 20,
      speedCoefficient: 0.3, // 0.3,
      strokeStyle: "#000000",
      framesPerSprite: 8,
      fps: 25,
    },
    public waveGenerator: ITDEngine["waveGenerator"] = null,
    public sound: ITDEngine["sound"] = new Sound(),
  ) {
    // safari polyfill
    if (typeof window !== "undefined" && !window.requestIdleCallback) {
      console.log("requestIdleCallback polyfill");
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
    if (typeof window !== "undefined" && !window.cancelIdleCallback) {
      window.cancelIdleCallback = function (id) {
        clearTimeout(id);
      };
    }
    // set waveGenerator
    this.waveGenerator = new WaveGenerator(this);
    this.money = this.initialGameParams.money;
    this.lives = this.initialGameParams.lives;
  }

  // create game canvas stack and append it to the game container
  public init(gameContainer: HTMLDivElement) {
    console.log("init");
    this.gameWindow = gameContainer;
    // set map
    this.setMap(new Map(this));
    // create game canvas stack container
    const canvasContainer = document.createElement("div");
    console.log("init 2", canvasContainer);
    canvasContainer.className = "b-canvas-wrapper";
    canvasContainer.style.width = `${this.map?.mapParams.width!}px`;
    canvasContainer.style.height = `${this.map?.mapParams.height!}px`;
    canvasContainer.style.position = "relative";
    canvasContainer.style.background = "";
    const createCanvas = (
      width: number = this.map?.mapParams.width!,
      height: number = this.map?.mapParams.height!,
    ) => {
      for (const [canvasId, zIndex] of Object.entries(this.canvasZIndex)) {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = width;
        newCanvas.height = height;
        if (canvasId === "build") {
          newCanvas.style.opacity = "0.4";
          newCanvas.tabIndex = 1;
        } else if (canvasId === "map") {
          newCanvas.style.background = "url('/sprites/map/grass.png') repeat";
        }
        newCanvas.style.zIndex = `${zIndex}`;
        newCanvas.id = `${canvasId}Canvas`;
        newCanvas.className = `b-${canvasId}-canvas`;
        newCanvas.style.position = "absolute";
        canvasContainer.appendChild(newCanvas);
        // set rendering context
        this.context![canvasId as TEngineCanvas] = newCanvas.getContext("2d")!;
      }
    };
    createCanvas();
    // inject created nodes into the page
    gameContainer.textContent = "";
    gameContainer.appendChild(canvasContainer);
    // set init flag to true
    this.isInitialized = true;
  }

  public addEventListeners() {
    // add canvas mousemove event listener
    this.context?.build!.canvas.addEventListener(
      "mousemove",
      this.canvasMouseMoveCallback,
    );
    // add canvas mouse click event listener
    this.context?.build!.canvas.addEventListener(
      "click",
      this.canvasClickCallback,
    );
    // add escape hotkey to cancel building mode
    this.gameWindow?.addEventListener("keydown", this.gameWindowKeydown);
  }

  public removeEventListeners = () => {
    // remove canvas mousemove event listener
    this.context?.build!.canvas.removeEventListener(
      "mousemove",
      this.canvasMouseMoveCallback,
    );
    // remove canvas mouse click event listener
    this.context?.build!.canvas.removeEventListener(
      "click",
      this.canvasClickCallback,
    );
    // remove escape hotkey to cancel building mode
    this.gameWindow?.removeEventListener("keydown", this.gameWindowKeydown);
  };

  public gameRestart() {
    // clear memory
    this.enemies = [];
    this.deadEnemies = [];
    this.towers = [];
    this.projectiles = [];
    // reset sound
    // game start sound
    this.sound?.soundArr?.gameStart?.pause();
    this.sound!.soundArr!.gameStart!.currentTime = 0;
    // clear tower canvas
    this.clearContext(this.context!.tower!);
    this.clearContext(this.context!.selection!);
    // wave generator
    clearInterval(this.waveGenerator!.waveCountdownTimer!);
    clearTimeout(this.waveGenerator!.waveTimerBetweenWaves!);
    this.waveGenerator!.waveCountdownTimer = null;
    this.waveGenerator!.waveTimerBetweenWaves = null;
    this.waveGenerator!.isInitialized = false;
    //
    this.isGameStarted = true;
    // create mapTilesArr
    this.map?.createMapTilesArr();
    // pop tiles which is occupied by map path
    this.map?.popMapPathTiles();
    // game params
    this.money = this.initialGameParams.money;
    this.lives = this.initialGameParams.lives;
    this.score = 0;
    // spawner
    this.waveGenerator!.waveParams.currentWave = 1;
    this.waveGenerator!.waveCountdown = Math.floor(
      this.waveGenerator!.waveTimeoutBetweenWaves / 1000,
    );
    setTimeout(() => {
      this.waveGenerator!.waveParams.isWaveInProgress = false;
      this.waveGenerator!.isUICountdown = false;
    }, this.waveGenerator!.waveTimeoutBetweenWaves);
  }

  public gamePause() {
    this.isGameStarted = false;
  }

  public gameStart() {
    this.isGameStarted = true;
  }

  public clearMemory() {
    this.enemies = [];
    this.deadEnemies = [];
    this.projectiles = [];
    for (let tower of this.towers!) {
      tower.target = null;
    }
  }

  public splitTowerSprite(towerType: TTowerSpriteTypes) {
    // load sprites from url paths
    this.towerSprites[towerType!]!.spriteSource =
      this.createTowerSpriteSource(towerType);
    // create canvases for each frame
    this.towerSprites[towerType]!.canvasArr =
      this.createTowerSpriteCanvasArr(towerType);
    // set their render context
    this.towerSprites[towerType]!.canvasContextArr =
      this.createTowerSpriteCanvasContext(
        this.towerSprites[towerType]!.canvasArr,
        towerType,
      );

    // wait for sprites to load
    for (const [element, source] of Object.entries(
      this.towerSprites[towerType]!.spriteSource!,
    )) {
      if (Array.isArray(source)) {
        source.forEach((imageSource, upgradeLevel) => {
          imageSource.onload = () => {
            // and draw proper frames in each canvas
            this.drawTowerFrameOnCanvas(
              element as TTowerSpriteElements,
              this.towerSprites[towerType]!.canvasContextArr![
                element as TTowerSpriteElements
              ][upgradeLevel]! as CanvasRenderingContext2D[],
              imageSource,
              towerType,
              upgradeLevel,
            );
          };
        });
      } else {
        source.onload = () => {
          // and draw proper frames in each canvas
          this.drawTowerFrameOnCanvas(
            element as TTowerSpriteElements,
            this.towerSprites[towerType]!.canvasContextArr![
              element as TTowerSpriteElements
            ]! as CanvasRenderingContext2D[],
            source,
            towerType,
          );
        };
      }
    }
  }

  public splitEnemySprite(enemyType: TEnemyType) {
    // split sprites into proper frames
    // and draw proper frames in each canvas
    this.createEnemySpriteSource();
    // split png sprite to separate canvases,
    this.enemySprites[enemyType]!.canvasArr = this.createEnemySpriteCanvasArr(
      enemyType,
      this.enemySprites[enemyType]!.framesPerSprite,
    );
    // set their render context
    this.enemySprites[enemyType]!.canvasContextArr =
      this.createEnemySpriteCanvasContext(
        this.enemySprites[enemyType]!.canvasArr,
      );

    this.enemySprites![enemyType]!.spriteSource!.onload = () => {
      // and draw proper frames in each canvas
      this.drawEnemyFrameOnCanvas(
        this.enemySprites[enemyType]!.canvasContextArr!,
        this.enemySprites[enemyType]!.spriteSource!,
        this.enemySprites[enemyType]!.spriteRightRow,
        this.enemySprites[enemyType]!.spriteLeftRow,
        this.enemySprites[enemyType]!.spriteUpRow,
        this.enemySprites[enemyType]!.spriteDownRow,
      );

      // debug
    };
  }

  public createCanvasArr(arrLength: number) {
    return Array.from(Array(arrLength), () => document.createElement("canvas"));
  }

  public createImageBySrc = (prefix: string, src: string): HTMLImageElement => {
    const img = new Image();
    img.src = `${prefix}${src}`;
    return img;
  };

  public createTowerSpriteSource(towerType: TTowerSpriteTypes) {
    const spriteSource: ITowerSprite["spriteSource"] = {};
    const pathPrefix = `sprites/tower/${towerType}/`;

    for (const [element, elementArr] of Object.entries(
      this.towerSprites[towerType]?.spriteSourcePath!,
    )) {
      if (Array.isArray(elementArr)) {
        const imageArr: HTMLImageElement[] = [];
        elementArr.forEach((path, index) => {
          if (element === "construction") {
            imageArr.push(
              this.createImageBySrc(`sprites/tower/construction/`, path),
            );
          } else if (element === "constructionEnd") {
            imageArr.push(
              this.createImageBySrc(`sprites/tower/construction/`, path),
            );
          } else {
            imageArr.push(this.createImageBySrc(pathPrefix, path));
          }
        });
        spriteSource[element as TTowerSpriteElements] = imageArr;
      } else {
        // base
        if (element === "base") {
          spriteSource[element as TTowerSpriteElements] = this.createImageBySrc(
            pathPrefix,
            elementArr,
          );
        }
      }
    }
    return spriteSource;
  }

  public createTowerSpriteCanvasArr(towerType: TTowerSpriteTypes) {
    return {
      base: this.createCanvasArr(3),
      construction: [
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.constructionFrameLimit!,
        ),
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.constructionFrameLimit!,
        ),
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.constructionFrameLimit!,
        ),
      ],
      constructionEnd: [
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.constructionFrameLimit!,
        ),
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.constructionFrameLimit!,
        ),
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.constructionFrameLimit!,
        ),
      ],
      impact: [
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.projectileParams
            ?.impactFrameLimit!,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.projectileParams
            ?.impactFrameLimit!,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.projectileParams
            ?.impactFrameLimit!,
        )!,
      ],
      weapon: [
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams?.cannonFrameLimit!,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams?.cannonFrameLimit!,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams?.cannonFrameLimit!,
        )!,
      ],
      projectile: [
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.projectileParams
            ?.projectileFrameLimit! + 1,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.projectileParams
            ?.projectileFrameLimit! + 1!,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.projectileParams
            ?.projectileFrameLimit! + 1!,
        )!,
      ],
    };
  }

  public createTowerSpriteCanvasContext(
    canvasArr: ITowerSprite["canvasArr"],
    towerType: TTowerSpriteTypes,
  ) {
    let contextArr: ITowerSprite["canvasContextArr"] = {
      base: [],
      construction: [[], [], []],
      constructionEnd: [[], [], []],
      impact: [[], [], []],
      weapon: [[], [], []],
      projectile: [[], [], []],
    };
    for (const [element, upgradeArr] of Object.entries(canvasArr!)) {
      switch (element as TTowerSpriteElements) {
        case "base": {
          upgradeArr.forEach((canvas, upgradeLevel) => {
            if (!Array.isArray(canvas)) {
              canvas.width =
                this.predefinedTowerParams[
                  towerType as TTowerSpriteTypes
                ]!.towerParams.baseWidth!;
              canvas.height =
                this.predefinedTowerParams[
                  towerType as TTowerSpriteTypes
                ]!.towerParams.baseHeight!;
              (contextArr?.base as CanvasRenderingContext2D[]).push(
                canvas.getContext("2d")!,
              );
            }
          });
          break;
        }
        case "construction": {
          upgradeArr.forEach((upgradeLevel, level) => {
            (upgradeLevel as HTMLCanvasElement[]).forEach((canvas) => {
              canvas.width =
                this.predefinedTowerParams[
                  towerType
                ]!.towerParams?.constructionWidth;
              canvas.height =
                this.predefinedTowerParams[
                  towerType
                ]!.towerParams?.constructionHeight;
              (
                contextArr!.construction[level]! as CanvasRenderingContext2D[]
              ).push(canvas.getContext("2d")!);
            });
          });
          break;
        }
        case "constructionEnd": {
          upgradeArr.forEach((upgradeLevel, level) => {
            (upgradeLevel as HTMLCanvasElement[]).forEach((canvas) => {
              canvas.width =
                this.predefinedTowerParams[
                  towerType
                ]!.towerParams?.constructionWidth;
              canvas.height =
                this.predefinedTowerParams[
                  towerType
                ]!.towerParams?.constructionHeight;
              (
                contextArr!.constructionEnd[
                  level
                ]! as CanvasRenderingContext2D[]
              ).push(canvas.getContext("2d")!);
            });
          });
          break;
        }
        case "weapon": {
          upgradeArr.forEach((upgradeLevel, level) => {
            (upgradeLevel as HTMLCanvasElement[]).forEach((canvas) => {
              canvas.width =
                this.predefinedTowerParams[towerType]!.towerParams?.dimensions[
                  level
                ]!.cannonWidth;
              canvas.height =
                this.predefinedTowerParams[towerType]!.towerParams?.dimensions[
                  level
                ]!.cannonHeight;
              (contextArr!.weapon[level]! as CanvasRenderingContext2D[]).push(
                canvas.getContext("2d")!,
              );
            });
          });
          break;
        }
        case "projectile": {
          upgradeArr.forEach((upgradeLevel, level) => {
            (upgradeLevel as HTMLCanvasElement[]).forEach((canvas) => {
              const canvasHypot = Math.ceil(
                Math.hypot(
                  this.predefinedTowerParams[towerType]!.projectileParams
                    ?.dimensions[level]!.projectileWidth,
                  this.predefinedTowerParams[towerType]!.projectileParams
                    ?.dimensions[level]!.projectileHeight,
                ),
              );
              canvas.width = canvasHypot;
              canvas.height = canvasHypot;
              (
                contextArr!.projectile[level]! as CanvasRenderingContext2D[]
              ).push(canvas.getContext("2d")!);
            });
          });
          break;
        }
        case "impact": {
          upgradeArr.forEach((upgradeLevel, level) => {
            (upgradeLevel as HTMLCanvasElement[]).forEach((canvas) => {
              canvas.width =
                this.predefinedTowerParams[
                  towerType
                ]!.projectileParams?.dimensions[level]!.impactWidth;
              canvas.height =
                this.predefinedTowerParams[
                  towerType
                ]!.projectileParams?.dimensions[level].impactHeight;
              (contextArr!.impact[level]! as CanvasRenderingContext2D[]).push(
                canvas.getContext("2d")!,
              );
            });
          });
          break;
        }
      }
    }
    return contextArr;
  }

  public createEnemySpriteSource() {
    for (const [enemyType, index] of Object.entries(this.enemySprites)) {
      this.enemySprites[enemyType as TEnemyType]!.spriteSource =
        this.createImageBySrc(
          `sprites/enemy/`,
          this.enemySprites[enemyType as TEnemyType]!.spriteSourcePath!,
        );
    }
  }

  public createEnemySpriteCanvasArr(type: TEnemyType, frames: number) {
    return {
      right: this.createCanvasArr(this.enemySprites[type!]?.framesPerSprite!),
      left: this.createCanvasArr(this.enemySprites[type!]?.framesPerSprite!),
      up: this.createCanvasArr(this.enemySprites[type!]?.framesPerSprite!),
      down: this.createCanvasArr(this.enemySprites[type!]?.framesPerSprite!),
      rightDead: this.createCanvasArr(
        this.enemySprites[type!]?.deathFramesPerSprite!,
      ),
      leftDead: this.createCanvasArr(
        this.enemySprites[type!]?.deathFramesPerSprite!,
      ),
      upDead: this.createCanvasArr(
        this.enemySprites[type!]?.deathFramesPerSprite!,
      ),
      downDead: this.createCanvasArr(
        this.enemySprites[type!]?.deathFramesPerSprite!,
      ),
    };
  }

  public createEnemySpriteCanvasContext(canvasArr: IEnemySprite["canvasArr"]) {
    let contextArr: IEnemySprite["canvasContextArr"] = {
      left: [],
      right: [],
      up: [],
      down: [],
      leftDead: [],
      rightDead: [],
      upDead: [],
      downDead: [],
    };
    for (const [direction, canvasArray] of Object.entries(canvasArr!)) {
      for (const canvas of canvasArray!) {
        canvas.width = this.map?.mapParams?.gridStep!;
        canvas.height = this.map?.mapParams?.gridStep!;
        contextArr[direction as TEnemySpriteDirection]!.push(
          canvas.getContext("2d")!,
        );
      }
    }
    return contextArr;
  }

  public drawFrame(
    context: CanvasRenderingContext2D,
    source: CanvasImageSource,
    sx = 0,
    sy = 0,
    sw = this.map?.mapParams?.gridStep!,
    sh = this.map?.mapParams?.gridStep!,
    dx = 0,
    dy = 0,
    dw = this.map?.mapParams?.gridStep!,
    dh = this.map?.mapParams?.gridStep!,
  ) {
    context.beginPath();
    context.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
    context.closePath();
  }

  public drawEnemyFrameOnCanvas(
    contextArr: IEnemySprite["canvasContextArr"],
    spriteSource: IEnemySprite["spriteSource"],
    spriteRightRow: IEnemySprite["spriteRightRow"],
    spriteLeftRow: IEnemySprite["spriteLeftRow"],
    spriteUpRow: IEnemySprite["spriteUpRow"],
    spriteDownRow: IEnemySprite["spriteDownRow"],
  ) {
    for (const [direction, contextArray] of Object.entries(contextArr!)) {
      contextArray.forEach((context, index) => {
        switch (direction) {
          case "right": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * spriteRightRow,
            );
            break;
          }
          case "left": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * spriteLeftRow,
            );
            break;
          }
          case "up": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * spriteUpRow,
            );
            break;
          }
          case "down": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * spriteDownRow,
            );
            break;
          }
          case "rightDead": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * (spriteRightRow + 4),
            );
            break;
          }
          case "leftDead": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * (spriteLeftRow + 4),
            );
            break;
          }
          case "upDead": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * (spriteUpRow + 4),
            );
            break;
          }
          case "downDead": {
            this.drawFrame(
              context,
              spriteSource!,
              index * this.map?.mapParams?.gridStep!,
              this.map?.mapParams?.gridStep! * (spriteDownRow + 4),
            );
            break;
          }
        }
      });
    }
  }

  public drawTowerFrameOnCanvas(
    element: TTowerSpriteElements,
    contextArr: CanvasRenderingContext2D[],
    spriteSource: CanvasImageSource,
    towerType: TTowerSpriteTypes,
    upgradeLevel = 0,
  ) {
    contextArr.forEach((context, index) => {
      switch (element) {
        case "base": {
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedTowerParams[towerType]?.towerParams?.baseWidth! *
              index,
            0,
            this.predefinedTowerParams[towerType]?.towerParams?.baseWidth!,
            this.predefinedTowerParams[towerType]?.towerParams?.baseHeight!,
            0,
            0,
            this.predefinedTowerParams[towerType]?.towerParams?.baseWidth!,
            this.predefinedTowerParams[towerType]?.towerParams?.baseHeight!,
          );
          break;
        }
        // construction
        case "construction": {
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionWidth! * index,
            0,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionWidth,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionHeight,
            0,
            0,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionWidth,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionHeight,
          );
          break;
        }
        // constructionEnd
        case "constructionEnd": {
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionWidth! * index,
            0,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionWidth,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionHeight,
            0,
            0,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionWidth,
            this.predefinedTowerParams[towerType]?.towerParams
              ?.constructionHeight,
          );
          break;
        }
        // weapons
        case "weapon": {
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedTowerParams[towerType]?.towerParams?.dimensions[
              upgradeLevel
            ].cannonWidth! * index,
            0,
            this.predefinedTowerParams[towerType]?.towerParams?.dimensions[
              upgradeLevel
            ].cannonWidth!,
            this.predefinedTowerParams[towerType]?.towerParams?.dimensions[
              upgradeLevel
            ].cannonHeight!,
            0,
            0,
            this.predefinedTowerParams[towerType]?.towerParams?.dimensions[
              upgradeLevel
            ].cannonWidth!,
            this.predefinedTowerParams[towerType]?.towerParams?.dimensions[
              upgradeLevel
            ].cannonHeight!,
          );
          break;
        }
        // projectiles
        case "projectile": {
          // find the widest or longest value of projectile canvas depending on firing angle
          const canvasHypot = Math.ceil(
            Math.hypot(
              this.predefinedTowerParams[towerType]!.projectileParams
                ?.dimensions[upgradeLevel].projectileWidth,
              this.predefinedTowerParams[towerType]!.projectileParams
                ?.dimensions[upgradeLevel].projectileHeight,
            ),
          );
          //
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedTowerParams[towerType]!.projectileParams?.dimensions[
              upgradeLevel
            ].projectileWidth * index,
            0,
            this.predefinedTowerParams[towerType]!.projectileParams?.dimensions[
              upgradeLevel
            ].projectileWidth,
            this.predefinedTowerParams[towerType]!.projectileParams?.dimensions[
              upgradeLevel
            ].projectileHeight,
            (canvasHypot -
              this.predefinedTowerParams[towerType]!.projectileParams
                ?.dimensions[upgradeLevel].projectileWidth) /
              2,
            (canvasHypot -
              this.predefinedTowerParams[towerType]!.projectileParams
                ?.dimensions[upgradeLevel].projectileHeight) /
              2,
            this.predefinedTowerParams[towerType]!.projectileParams?.dimensions[
              upgradeLevel
            ].projectileWidth,
            this.predefinedTowerParams[towerType]!.projectileParams?.dimensions[
              upgradeLevel
            ].projectileHeight,
          );
          break;
        }
        // impacts
        case "impact": {
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedTowerParams[towerType]?.projectileParams?.dimensions[
              upgradeLevel
            ].impactWidth! * index,
            0,
            this.predefinedTowerParams[towerType]?.projectileParams?.dimensions[
              upgradeLevel
            ].impactWidth!,
            this.predefinedTowerParams[towerType]?.projectileParams?.dimensions[
              upgradeLevel
            ].impactHeight!,
            0,
            0,
            this.predefinedTowerParams[towerType]?.projectileParams?.dimensions[
              upgradeLevel
            ].impactWidth!,
            this.predefinedTowerParams[towerType]?.projectileParams?.dimensions[
              upgradeLevel
            ].impactHeight!,
          );
          break;
        }
      }
    });
  }

  public manageHotkeys(e: KeyboardEvent) {
    // cancel building mode
    if (e.key === "Escape") {
      // exit building mode
      if (this.isCanBuild) {
        this.isCanBuild = false;
        this.isShowGrid = false;
      }
      // clear selected tower
      if (this.selectedTower) {
        this.clearTowerSelection(this.selectedTower);
      }
    }

    if (e.key === "1") {
      this.draftTower = null;
      this.isShowGrid = false;
      this.buildTower("one", 0);
    }
    if (e.key === "2") {
      this.draftTower = null;
      this.buildTower("two", 0);
    }
    if (e.key === "3") {
      this.draftTower = null;
      this.buildTower("three", 0);
    }
    if (e.key === "4") {
      this.draftTower = null;
      this.buildTower("four", 0);
    }
    if (e.key === "s") {
      this.gameStart();
    }
    if (e.key === "p") {
      this.gamePause();
    }
    // log mode
    if (e.key === "0") {
      // debug
      console.log("engine");
      console.log(this);
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

  public buildTower = (
    type: TTowerSpriteTypes,
    upgradeLevel: Tower["upgradeLevel"],
  ) => {
    if (
      this.isEnoughMoney(this.predefinedTowerParams[type]!.towerParams.price)
    ) {
      this.isCanBuild = true;
      this.draftTower = new Tower(
        this,
        type,
        upgradeLevel,
        this.draftBuildCoordinates,
        structuredClone(this.predefinedTowerParams[type]?.towerParams!),
        structuredClone(this.predefinedTowerParams[type]?.projectileParams!),
      );
    }
  };

  public findClosestTile(
    coordinates: ITwoDCoordinates,
    tilesArr: ITwoDCoordinates[] = this.map?.mapParams.mapTilesArr!,
  ): ITwoDCoordinates {
    let minDistance = this.map?.mapParams.width;
    tilesArr.forEach((tile) => {
      const distance =
        (tile.x -
          coordinates.x! +
          this.map?.mapParams.gridStep! -
          this.map?.mapParams?.tileCenter!) *
          (tile.x -
            coordinates.x! +
            this.map?.mapParams.gridStep! -
            this.map?.mapParams?.tileCenter!) +
        (tile.y - coordinates.y! + this.map?.mapParams?.tileCenter!) *
          (tile.y - coordinates.y! + this.map?.mapParams?.tileCenter!);
      if (distance < minDistance!) {
        minDistance = distance;
        this.map!.mapParams.closestTile! = tile!;
      }
    });

    this.draftBuildCoordinates = {
      x: this.map?.mapParams.closestTile.x! + this.map?.mapParams.gridStep!,
      y: this.map?.mapParams.closestTile.y! + this.map?.mapParams.gridStep!,
    };

    return {
      x: this.map?.mapParams.closestTile.x!,
      y: this.map?.mapParams.closestTile.y!,
    };
  }

  public highlightTile(
    coords: ITwoDCoordinates,
    context: CanvasRenderingContext2D = this.context!.game!,
  ) {
    context.beginPath();
    context.strokeStyle = "green";
    context.setLineDash([]);
    context.strokeRect(
      coords.x,
      coords.y,
      this.map?.mapParams.gridStep!,
      this.map?.mapParams.gridStep!,
    );
    context.closePath();
  }

  public canvasMouseMoveCallback = (e: MouseEvent) => {
    this.cursorPosition = {
      x: e.offsetX,
      y: e.offsetY,
    };
    this.map!.mapParams.closestTile = this.findClosestTile(this.cursorPosition);
    if (this.isCanBuild) {
      this.draftShowTower();
    }
  };

  public canvasClickCallback = (e: MouseEvent) => {
    // build tower
    if (this.isCanBuild) {
      this.draftBuildTower();
    } else {
      this.selectTower();
    }
  };

  public upgradeTower(tower: Tower) {
    // max upgrade level check
    if (tower.upgradeLevel === tower.towerParams.maxUpgradeLevel! - 1) return;
    // remove selection
    tower.towerParams.isSelected = false;
    // disable attack interval
    // tower.clearAttackInterval();
    tower.isCanFire = false;
    // release tower target
    tower.target = null;
    // set render params
    tower.upgradeLevel += 1;
    tower.renderParams.constructionTimeout = tower.upgradeLevel
      ? tower.renderParams.constructionTimeout * tower.upgradeLevel
      : tower.renderParams.constructionTimeout;
    tower.renderParams.isConstructing = true;
  }

  public clearTowerSelection(
    tower: Tower = this.selectedTower!,
    context: CanvasRenderingContext2D = this.context?.selection!,
  ) {
    tower.towerParams.isSelected = false;
    this.clearContext(context);
    this.selectedTower = null;
  }

  public selectTower() {
    if (!this.towers?.length) return;
    const closestTile = this.findClosestTile(
      {
        x: this.cursorPosition.x + this.map?.mapParams?.gridStep!,
        y: this.cursorPosition.y + this.map?.mapParams?.gridStep!,
      },
      this.map?.mapParams?.towerTilesArr,
    );
    this.towers.forEach((tower) => {
      // can't select towers while constructing
      if (tower.renderParams.isConstructing) return;
      // remove previous selection
      if (this.selectedTower === tower) {
        this.clearTowerSelection();
      }
      // set new selection
      if (
        tower.currentPosition.x === closestTile.x &&
        tower.currentPosition.y === closestTile.y
      ) {
        this.selectedTower = tower;
        this.selectedTower.towerParams.isSelected = true;
        this.clearContext(this.context?.selection!);
        this.selectedTower.drawSelection();
        return;
      }
    });
  }

  public gameWindowKeydown = (e: KeyboardEvent) => {
    this.manageHotkeys(e);
  };

  public isEnoughMoney(towerPrice: Tower["towerParams"]["price"]) {
    if (this.money >= towerPrice!) {
      return true;
    }
    this.isNotEnoughMoney = true;
    return false;
  }

  public draftShowTower() {
    if (!this.isCanBuild) return;
    // show building grid
    // this.isShowGrid = true;

    this.draftTower!.currentPosition = this.draftBuildCoordinates;
    this.draftTower!.towerParams.strokeStyle = "green";
    // this.draftTower!.drawDraft();
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

          this.draftTower!.currentPosition = this.draftBuildCoordinates;

          // set strokeStyle to default
          this.draftTower!.towerParams.strokeStyle =
            this.initialGameParams.strokeStyle;

          // set tower is constructing flag
          this.draftTower!.renderParams.isConstructing = true;

          // add new tower
          this.towers = [...this.towers!, this.draftTower!];

          // push tile to towerTilesArr
          this.map!.mapParams.towerTilesArr.push(this.draftBuildCoordinates);

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
          this.money -= this.draftTower?.towerParams.price!;
          this.draftTower = null;
          // this.map.mapParams.closestTile = this.findClosestTile(this.cursorPosition)
        }
      } else {
        this.isNotEnoughMoney = true;
      }
    }
  }

  public clearContext(context: CanvasRenderingContext2D) {
    context.clearRect(
      0,
      0,
      this.map?.mapParams.width!,
      this.map?.mapParams.height!,
    );
  }

  public clearCanvas() {
    // clear game canvas
    this.clearContext(this.context!.game!);
    this.clearContext(this.context!.cannon!);
    this.clearContext(this.context!.constructing!);
    this.clearContext(this.context!.hpBar!);
    this.clearContext(this.context!.projectile!);
    this.clearContext(this.context!.build!);
    this.clearContext(this.context!.enemy!);
    this.clearContext(this.context!.deadEnemy!);
    // this.clearContext(this.context.tower!);
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

  public setUICallback(callback: () => void) {
    this.UICallback = callback;
  }

  public pushProjectile(projectile: Projectile) {
    this.projectiles?.push(projectile);
  }

  public stopGame() {
    cancelAnimationFrame(this.animationFrameId);
    cancelIdleCallback(this.requestIdleCallback);
  }

  public gameLoop = () => {
    setTimeout(() => {
      // game start
      if (this.isGameStarted) {
        if (this.lives > 0) {
          // clear canvas
          this.clearCanvas();

          // build mode
          if (this.isCanBuild) {
            if (this.draftTower) {
              this.draftTower.drawDraft();
            }
          }

          // draw enemies
          if (this.enemies?.length) {
            this.enemies?.forEach((enemy: Enemy) => {
              if (enemy.renderParams.isAnimateDeath) return;
              if (
                enemy.currentPosition.x +
                  enemy.enemyParams.width! +
                  enemy.randomOffset.x <
                0
              )
                return;
              enemy.draw(this.context!.enemy!, true);
            });
          }

          // draw dead enemies
          if (this.deadEnemies?.length) {
            this.deadEnemies?.forEach((deadEnemy: Enemy) => {
              deadEnemy.draw(this.context!.deadEnemy!, false);
            });
          }

          // draw projectiles
          if (this.projectiles?.length) {
            this.projectiles?.forEach((projectile: Projectile) => {
              projectile.draw();
            });
          }

          // draw tower parts
          if (this.towers?.length) {
            this.towers?.forEach((tower: Tower) => {
              if (tower.renderParams.isConstructing) {
                tower.drawConstructing();
              } else {
                tower.drawCannon(this.context!.cannon!);
              }
            });
          }

          // highlight the closest map tile to the cursor
          // engine.highlightTile(engine.map!.mapParams.closestTile);
          //
        } else {
          // GAME IS OVER!
        }

        // request animation frame
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
      } else {
        // cancel browser idle callback fn
        cancelAnimationFrame(this.animationFrameId);
      }
    }, 1000 / this.initialGameParams.fps);
  };

  public gameLoopLogic = () => {
    if (this.lives > 0) {
      if (this.isGameStarted) {
        // UI callback
        this.UICallback();
        // enemy init || move
        if (!this.waveGenerator?.isInitialized) {
          if (!this.waveGenerator?.waveTimerBetweenWaves) {
            // UI countdown between waves
            this.waveGenerator?.countdown();
            this.waveGenerator!.waveTimerBetweenWaves = setTimeout(() => {
              this.waveGenerator?.init();
            }, this.waveGenerator?.waveTimeoutBetweenWaves);
          }
        } else {
          // isWaveInProgress?
          if (
            this.enemies?.length === 0 &&
            this.waveGenerator?.waveParams.isWaveInProgress
          ) {
            this.waveGenerator.waveParams.isWaveInProgress = false;
            this.waveGenerator!.waveCountdown! = Math.floor(
              this.waveGenerator!.waveTimeoutBetweenWaves / 1000,
            );
            if (!this.waveGenerator.waveTimerBetweenWaves) {
              // UI countdown between waves
              this.waveGenerator.waveCountdownTimer = setInterval(() => {
                if (this.waveGenerator!.waveCountdown > 0) {
                  this.waveGenerator!.waveCountdown -= 1;
                } else {
                  clearInterval(this.waveGenerator?.waveCountdownTimer!);
                  this.waveGenerator!.isUICountdown = false;
                }
              }, 1000);
              this.waveGenerator!.waveTimerBetweenWaves = setTimeout(() => {
                this.clearMemory();
                this.waveGenerator?.spawnEnemies();
              }, this.waveGenerator.waveTimeoutBetweenWaves);
            }
          }
        }

        // search n destroy
        if (this.enemies?.length) {
          this.towers?.forEach((tower: Tower) => {
            if (tower.renderParams.isConstructing) return;
            if (tower.target) {
              if (tower.isEnemyInRange(tower.target)) {
                tower.findTargetAngle();
                tower.fire();
              } else {
                tower.findTarget();
              }
            } else {
              tower.findTarget();
            }
          });
        }

        // move enemies
        if (this.enemies?.length) {
          this.enemies?.forEach((enemy: Enemy) => {
            enemy.move();
          });
        }

        // move projectiles
        if (this.projectiles?.length) {
          this.projectiles?.forEach((projectile: Projectile) => {
            projectile.move();
          });
        }

        // request callback when browser is idling
        this.requestIdleCallback = requestIdleCallback(this.gameLoopLogic, {
          timeout: 1000 / this.initialGameParams.fps,
          // timeout: this.idleTimeout,
        });
      } else {
        cancelIdleCallback(this.requestIdleCallback);
      }
    } else {
      // game is over!
      this.isGameStarted = false;
      this.isGameOver = true;
    }
  };
}
