import { Enemy } from "../enemies/Enemy";
import { Tower } from "../towers/Tower";
import { Map } from "../maps/Map";
import { Projectile } from "../projectiles/Projectile";
import { Sound } from "@/pages/Game/sound/Sound";
import { useGameStore } from "@/store";
import { ISpell, Spell } from "@/pages/Game/spells/Spell";

// utilities declaration
export type TPartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

// types declaration
export type TEngineCanvas =
  | "build"
  | "spell"
  | "spellDraft"
  | "projectile"
  | "constructing"
  | "selection"
  | "hpBar"
  | "game"
  | "cannon"
  | "tower"
  | "enemy"
  | "deadEnemy"
  | "map"
  | "mapDecorations"
  | "mapBackground";
export type TTowerTypes = "one" | "two" | "three" | "four";
export type TSpellTypes = "fireball" | "tornado";
export type TEnemyType =
  | "firebug"
  | "leafbug"
  | "scorpion"
  | "firewasp"
  | "clampbeetle"
  | "firelocust";
type TSpellSprite = Record<TSpellTypes, ISpellSprite | null>;
export type TSpellSpriteElements = "spell" | "impact";
type TTowerSprite = Record<TTowerTypes, ITowerSprite | null>;
export type TTowerSpriteElements =
  | "base"
  | "construction"
  | "constructionEnd"
  | "constructionSell"
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
export interface ISpellSprite {
  spriteSourcePath?: string;
  spriteSource: HTMLImageElement | null;
  canvasArr: TPartialRecord<TSpellSpriteElements, HTMLCanvasElement[]> | null;
  canvasContextArr: TPartialRecord<
    TSpellSpriteElements,
    CanvasRenderingContext2D[]
  > | null;
}
export interface ITowerSprite {
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

// zustand
const gameStore = useGameStore;

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

  public spawnEnemies() {
    // fill enemies array
    if (this.waveParams.currentWave < this.waveParams.endWave) {
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

export interface ITDEngine {
  context?: TPartialRecord<TEngineCanvas, CanvasRenderingContext2D>;
  gameWindow?: HTMLElement | null;
  enemies?: Enemy[];
  towers?: Tower[];
  projectiles?: Projectile[];
  spells?: Spell[];
  map?: Map;
  animationFrameId: number;
  requestIdleCallback: number;
  twoDCoordinates: ITwoDCoordinates;
  lives: number;
  score: number;
  enemiesLeft: number;
  money: number;
  mana: number;
  manaIncrementQuantity: number;
  manaIncrementTimer: NodeJS.Timer | null;
  manaIncrementTimeout: number;
  idleTimeout: number;
  isInitialized: boolean;
  promiseArr: Promise<string | number>[];
  isCanvasCreated: boolean;
  isCanBuild: boolean;
  isCanCast: boolean;
  isGameStarted: boolean;
  isSideMenuOpen: boolean;
  isBuildMenuOpen: boolean;
  isGameOver: boolean;
  isShowGrid: boolean;
  isNotEnoughMoney: boolean;
  isNotEnoughMana: boolean;
  isGameMenuOpen: boolean;
  isSoundEnabled: boolean;
  canvasMouseMoveEvent: EventListener | null;
  draftSpell: Spell | null;
  draftTower: Tower | null;
  selectedTower: Tower | null;
  cursorPosition: ITwoDCoordinates;
  spellSprites: TSpellSprite;
  towerSprites: TTowerSprite;
  enemySprites: TEnemySprite;
  mapSprites: TImageSprite[];
  predefinedSpellParams: Record<
    TSpellTypes,
    Record<
      TSpellSpriteElements,
      {
        framesPerSprite: number;
        width: number;
        height: number;
      }
    > & {
      spellParams: ISpell["spellParams"];
    }
  >;
  predefinedTowerParams: Record<
    TTowerTypes,
    {
      towerParams: Tower["towerParams"];
      projectileParams: Tower["projectileParams"];
    }
  >;
  initialGameParams: {
    money: number;
    lives: number;
    mana: number;
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
  UIDispatchBoolean: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  UIDispatchTower: (
    value: Tower | null | ((prevVar: Tower | null) => Tower | null),
  ) => void;
  UIDispatchNumber: (value: number | ((prevVar: number) => number)) => void;
  UIIsForceRender: boolean;
}

export class TDEngine {
  constructor(
    public map?: ITDEngine["map"],
    public enemies: ITDEngine["enemies"] = [],
    public deadEnemies: ITDEngine["enemies"] = [],
    public towers: ITDEngine["towers"] = [],
    public projectiles: ITDEngine["projectiles"] = [],
    public spells: ITDEngine["spells"] = [],
    public context: ITDEngine["context"] = {},
    public gameWindow: ITDEngine["gameWindow"] = null,
    public animationFrameId: ITDEngine["animationFrameId"] = 0,
    public requestIdleCallback: ITDEngine["requestIdleCallback"] = 0,
    public UIGameIsOver?: ITDEngine["UIDispatchBoolean"],
    public lives: ITDEngine["lives"] = 0,
    public score: ITDEngine["score"] = 0,
    public money: ITDEngine["money"] = 0,
    public mana: ITDEngine["mana"] = 100,
    public manaIncrementQuantity: ITDEngine["manaIncrementQuantity"] = 4,
    public manaIncrementTimer: ITDEngine["manaIncrementTimer"] = null,
    public manaIncrementTimeout: ITDEngine["manaIncrementTimeout"] = 4500,
    public canvasZIndex: Record<TEngineCanvas, number> = {
      build: 80,
      spell: 75,
      spellDraft: 74,
      projectile: 73,
      hpBar: 72,
      constructing: 71,
      selection: 70,
      game: 60,
      cannon: 50,
      tower: 40,
      enemy: 30,
      deadEnemy: 20,
      mapDecorations: 13,
      mapBackground: 12,
      map: 11,
    } as const,
    public isInitialized: ITDEngine["isInitialized"] = false,
    public promiseArr: ITDEngine["promiseArr"] = [],
    public isCanvasCreated: ITDEngine["isCanvasCreated"] = false,
    public isCanBuild: ITDEngine["isCanBuild"] = false,
    public isCanCast: ITDEngine["isCanCast"] = false,
    public isGameStarted: ITDEngine["isGameStarted"] = false,
    public isGameOver: ITDEngine["isGameOver"] = false,
    public isShowGrid: ITDEngine["isShowGrid"] = false,
    public isNotEnoughMoney: ITDEngine["isNotEnoughMoney"] = false,
    public isNotEnoughMana: ITDEngine["isNotEnoughMana"] = false,
    public isSoundEnabled: ITDEngine["isSoundEnabled"] = true,
    public draftSpell: ITDEngine["draftSpell"] = null,
    public draftTower: ITDEngine["draftTower"] = null,
    public selectedTower: ITDEngine["selectedTower"] = null,
    public cursorPosition: ITDEngine["cursorPosition"] = { x: 0, y: 0 },
    public draftBuildCoordinates: ITwoDCoordinates = { x: 0, y: 0 },
    public towerAngleOffset: number = Math.PI / 2.5,
    public spellSprites: ITDEngine["spellSprites"] = {
      fireball: {
        spriteSourcePath: "fireballSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      tornado: {
        spriteSourcePath: "tornadoSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
    },
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
          constructionSell: "constructionSell.png",
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
          constructionSell: "constructionSell.png",
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
          constructionSell: "constructionSell.png",
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
          constructionSell: "constructionSell.png",
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
    public isSpellSpritesLoaded = false,
    public isTowerSpritesLoaded = false,
    public isEnemySpritesLoaded = false,
    public isMapSpritesLoaded = false,
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
    public predefinedSpellParams: ITDEngine["predefinedSpellParams"] = {
      fireball: {
        spell: {
          framesPerSprite: 10,
          width: 64,
          height: 64,
        },
        impact: {
          framesPerSprite: 13,
          width: 64,
          height: 64,
        },
        spellParams: {
          attackRange: 80,
          attackDamage: 100,
          manaCost: 20,
          movementSpeed: 4,
        },
      },
      tornado: {
        spell: {
          framesPerSprite: 10,
          width: 64,
          height: 64,
        },
        impact: {
          framesPerSprite: 9,
          width: 64,
          height: 64,
        },
        spellParams: {
          attackRange: 40,
          attackDamage: 10,
          attackModifier: "slow",
          attackModifierTimeout: 5000,
          manaCost: 15,
          movementSpeed: 2,
        },
      },
    },
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
          constructionSellFrameLimit: 13,
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
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          strokeStyle: "green",
          maxUpgradeLevel: 2,
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
          constructionSellFrameLimit: 13,
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
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
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
          attackModifier: "shock",
          attackModifierTimeout: 300,
        },
      },
      three: {
        towerParams: {
          attackRate: 3000,
          attackDamage: 8,
          attackRange: 250,
          baseWidth: 64,
          baseHeight: 128,
          constructionWidth: 192,
          constructionHeight: 256,
          constructionFrameLimit: 6,
          constructionSellFrameLimit: 13,
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
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
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
          attackModifier: "slow",
          attackModifierTimeout: 3000,
        },
      },
      four: {
        towerParams: {
          attackRate: 6000,
          attackDamage: 45,
          attackRange: 240,
          baseWidth: 64,
          baseHeight: 128,
          constructionWidth: 192,
          constructionHeight: 256,
          constructionFrameLimit: 6,
          constructionSellFrameLimit: 13,
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
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
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
          attackModifier: "splash",
          attackModifierRange: 80,
        },
      },
    },
    public initialGameParams: ITDEngine["initialGameParams"] = {
      money: 100,
      mana: 100,
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
    if (typeof window === "object" && !window.requestIdleCallback) {
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
    if (typeof window === "object" && !window.cancelIdleCallback) {
      window.cancelIdleCallback = function (id) {
        clearTimeout(id);
      };
    }
    // set waveGenerator
    this.waveGenerator = new WaveGenerator(this);
    this.money = this.initialGameParams.money;
    this.lives = this.initialGameParams.lives;
    this.mana = this.initialGameParams.mana;
    // UI
    gameStore.getState().updateMoney(this.money);
    gameStore.getState().updateMana(this.mana);
    gameStore.getState().updateLives(this.lives);
  }

  // create game canvas stack and append it to the game container
  public async init(gameContainer: HTMLDivElement) {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) reject();
      this.gameWindow = gameContainer;
      // set map
      this.map = new Map(this);
      /* LOAD SPRITES */
      // tower sprites
      if (!this.isTowerSpritesLoaded) {
        for (const [towerType, _] of Object.entries(this.towerSprites)) {
          this.splitTowerSprite(towerType as TTowerTypes);
        }
        this.isTowerSpritesLoaded = true;
      }

      // map sprites
      this.map
        .init()
        .then(() => {
          this.createCanvas(gameContainer)
            .then(() => {
              Promise.all(this.promiseArr).then(() => {
                resolve(`Canvas stack has been created!`);
              });
            })
            .catch((e) => {
              reject(`Can't create canvas stack! Reason: ${e.reason ?? e}`);
            });
        })
        .catch(reject);
      // we need just tower and map sprites, all other can be loaded in the future

      // enemy sprites
      if (!this.isEnemySpritesLoaded!) {
        for (const [enemyType] of Object.entries(this.enemySprites)) {
          this.splitEnemySprite(enemyType as TEnemyType);
        }
        this.isEnemySpritesLoaded = true;
      }
      // spell sprites
      if (!this.isSpellSpritesLoaded) {
        for (const [spellType, _] of Object.entries(this.spellSprites)) {
          this.splitSpellSprite(spellType as TSpellTypes);
        }
        this.isSpellSpritesLoaded = true;
      }
      /* /LOAD SPRITES */
    });
  }

  public createCanvas(gameContainer: HTMLDivElement) {
    return new Promise((resolve, reject) => {
      if (this.isCanvasCreated) reject(`Canvas is already created`);
      // create game canvas stack container
      const canvasContainer = document.createElement("div");
      canvasContainer.className = "b-canvas-wrapper";
      canvasContainer.style.width = `${this.map?.mapParams.width!}px`;
      canvasContainer.style.height = `${this.map?.mapParams.height!}px`;
      canvasContainer.style.position = "relative";
      canvasContainer.style.background = "";
      for (const [canvasId, zIndex] of Object.entries(this.canvasZIndex)) {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = this.map?.mapParams?.width!;
        newCanvas.height = this.map?.mapParams?.height!;
        if (canvasId === "build") {
          newCanvas.style.opacity = "0.4";
          newCanvas.tabIndex = 2;
        } else if (canvasId === "spellDraft") {
          newCanvas.style.opacity = "0.4";
          newCanvas.tabIndex = -1;
        } else if (canvasId === "map") {
          newCanvas.style.background = `url("${this.map?.grassBackrgroundCanvas?.toDataURL()}") repeat`;
        }
        newCanvas.style.zIndex = `${zIndex}`;
        newCanvas.id = `${canvasId}Canvas`;
        newCanvas.className = `b-${canvasId}-canvas`;
        newCanvas.style.position = "absolute";
        canvasContainer.appendChild(newCanvas);
        // set rendering context
        this.context![canvasId as TEngineCanvas] = newCanvas.getContext("2d")!;
      }
      // inject created nodes into the page
      gameContainer.appendChild(canvasContainer);

      // set canvas created flag to true
      this.isCanvasCreated = true;

      // return sucess
      resolve(`Success`);
    });
  }

  public addDocumentEventListeners(container: Document = document) {
    window.addEventListener("keydown", this.gameWindowKeydown);
  }

  public removeDocumentEventListeners(container: Document = document) {
    window.removeEventListener("keydown", this.gameWindowKeydown);
  }

  public addEventListeners() {
    // add canvas mousemove event listener
    this.gameWindow?.addEventListener(
      "mousemove",
      this.canvasMouseMoveCallback,
    );
    // add canvas mouse click event listener
    this.gameWindow?.addEventListener("click", this.canvasClickCallback);
  }

  public removeEventListeners = () => {
    // remove canvas mousemove event listener
    this.gameWindow?.removeEventListener(
      "mousemove",
      this.canvasMouseMoveCallback,
    );
    // remove canvas mouse click event listener
    this.gameWindow?.removeEventListener("click", this.canvasClickCallback);
  };

  public gameRestart() {
    // clear memory
    this.enemies = [];
    this.deadEnemies = [];
    this.towers = [];
    this.projectiles = [];
    // reset sound
    // game start sound
    this.isSoundEnabled = true;
    this.sound?.soundArr?.gameStart?.pause();
    this.sound!.soundArr!.gameStart!.currentTime = 0;
    this.sound?.soundArr?.gameStart?.play();
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
    this.mana = this.initialGameParams.mana;
    this.score = 0;
    // UI
    gameStore.getState().updateMoney(this.initialGameParams.money);
    gameStore.getState().updateMana(this.initialGameParams.mana);
    gameStore.getState().updateLives(this.initialGameParams.lives);
    gameStore.getState().updateScore(this.score);
    gameStore.getState().updateWaveNumber(1);
    gameStore.getState().updateEnemiesLeft(this.enemies.length);
    gameStore.getState().updateIsGameOver(false);
    // spawner
    this.waveGenerator!.waveParams.currentWave = 1;
    this.waveGenerator!.waveCountdown = Math.floor(
      this.waveGenerator!.waveTimeoutBetweenWaves / 1000,
    );
    setTimeout(() => {
      this.waveGenerator!.waveParams.isWaveInProgress = false;
      gameStore.getState().updateCountdown(0);
    }, this.waveGenerator!.waveTimeoutBetweenWaves);
  }

  public gameStart() {
    if (!gameStore.getState().isGameStarted) {
      gameStore.getState().updateIsGameStarted(true);
    } else {
      this.gameLoop();
      this.gameLoopLogic();
      // add event listeners
      this.addEventListeners();
      // game start play sound
      if (this.isSoundEnabled) {
        this.sound?.soundArr?.gameStart?.play();
      }
      // close game menu if opened
      if (gameStore.getState().isGameMenuOpen) {
        gameStore.getState().updateIsGameMenuOpen(false);
      }
    }
  }

  public gameStop() {
    gameStore.getState().updateIsGameStarted(false);
    cancelAnimationFrame(this.animationFrameId);
    cancelIdleCallback(this.requestIdleCallback);
    // remove event listeners
    this.removeEventListeners();

    // game start pause sound
    if (this.isSoundEnabled) {
      this.sound?.soundArr?.gameStart?.pause();
    }
    // close game menu if opened
    if (gameStore.getState().isGameMenuOpen) {
      gameStore.getState().updateIsGameMenuOpen(false);
    }
  }

  public clearMemory() {
    this.enemies = [];
    this.deadEnemies = [];
    this.projectiles = [];
    for (let tower of this.towers!) {
      tower.target = null;
    }
  }

  public splitSpellSprite(spellType: TSpellTypes) {
    // load sprites from url paths
    this.spellSprites[spellType]!.spriteSource =
      this.createSpellSpriteSource(spellType);
    // create canvases for each frame
    this.spellSprites[spellType]!.canvasArr =
      this.createSpellSpriteCanvasArr(spellType);
    // set their render context
    this.spellSprites[spellType]!.canvasContextArr =
      this.createSpellSpriteCanvasContext(
        this.spellSprites[spellType]!.canvasArr,
        spellType,
      );

    // wait for sprites to load
    this.spellSprites[spellType]!.spriteSource!.onload = () => {
      // and draw proper frames in each canvas
      for (const [element, canvas] of Object.entries(
        this.spellSprites[spellType]!.canvasArr!,
      )) {
        this.drawSpellFrameOnCanvas(
          element as TSpellSpriteElements,
          this.spellSprites[spellType!]!.canvasContextArr![
            element as TSpellSpriteElements
          ]!,
          this.spellSprites[spellType]!.spriteSource!,
          spellType,
        );
      }
    };
  }

  public splitTowerSprite(towerType: TTowerTypes) {
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

  public createSpellSpriteSource(spellType: TSpellTypes) {
    const pathPrefix = `sprites/spells/`;

    return this.createImageBySrc(
      pathPrefix,
      this.spellSprites[spellType]?.spriteSourcePath!,
    );
  }

  public createTowerSpriteSource(towerType: TTowerTypes) {
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
        } else if (element === "constructionSell") {
          spriteSource[element as TTowerSpriteElements] = this.createImageBySrc(
            `sprites/tower/construction/`,
            elementArr,
          );
        }
      }
    }
    return spriteSource;
  }

  public createSpellSpriteCanvasArr(spellType: TSpellTypes) {
    return {
      spell: this.createCanvasArr(
        this.predefinedSpellParams[spellType].spell.framesPerSprite,
      ),
      impact: this.createCanvasArr(
        this.predefinedSpellParams[spellType].impact.framesPerSprite,
      ),
    };
  }

  public createSpellSpriteCanvasContext(
    canvasArr: ISpellSprite["canvasArr"],
    spellType: TSpellTypes,
  ) {
    let contextArr: ISpellSprite["canvasContextArr"] = {
      spell: [],
      impact: [],
    };
    for (const [element, upgradeArr] of Object.entries(canvasArr!)) {
      switch (element as TSpellSpriteElements) {
        case "spell": {
          upgradeArr.forEach((canvas) => {
            canvas.width = this.predefinedSpellParams[spellType]!.spell.width!;
            canvas.height =
              this.predefinedSpellParams[spellType]!.spell.height!;
            contextArr?.spell!.push(canvas.getContext("2d")!);
          });
          break;
        }
        case "impact": {
          upgradeArr.forEach((canvas) => {
            canvas.width = this.predefinedSpellParams[spellType]!.impact.width!;
            canvas.height =
              this.predefinedSpellParams[spellType]!.impact.height!;
            contextArr?.impact!.push(canvas.getContext("2d")!);
          });
          break;
        }
      }
    }

    return contextArr;
  }

  public createTowerSpriteCanvasArr(towerType: TTowerTypes) {
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
      constructionSell: this.createCanvasArr(
        this.predefinedTowerParams[towerType]?.towerParams
          ?.constructionSellFrameLimit!,
      ),
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
    towerType: TTowerTypes,
  ) {
    let contextArr: ITowerSprite["canvasContextArr"] = {
      base: [],
      construction: [[], [], []],
      constructionEnd: [[], [], []],
      constructionSell: [],
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
                  towerType as TTowerTypes
                ]!.towerParams.baseWidth!;
              canvas.height =
                this.predefinedTowerParams[
                  towerType as TTowerTypes
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
        case "constructionSell": {
          upgradeArr.forEach((canvas, upgradeLevel) => {
            if (!Array.isArray(canvas)) {
              canvas.width =
                this.predefinedTowerParams[
                  towerType as TTowerTypes
                ]!.towerParams?.constructionHeight!;
              canvas.height =
                this.predefinedTowerParams[
                  towerType as TTowerTypes
                ]!.towerParams?.constructionWidth!;
              (contextArr?.constructionSell as CanvasRenderingContext2D[]).push(
                canvas.getContext("2d")!,
              );
            }
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

  public drawSpellFrameOnCanvas(
    element: TSpellSpriteElements,
    contextArr: CanvasRenderingContext2D[],
    spriteSource: CanvasImageSource,
    spellType: TSpellTypes,
  ) {
    contextArr.forEach((context, index) => {
      switch (element) {
        case "spell": {
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedSpellParams[spellType]?.spell.width! * index,
            0,
            this.predefinedSpellParams[spellType]?.spell.width!,
            this.predefinedSpellParams[spellType]?.spell.height!,
            0,
            0,
            this.predefinedSpellParams[spellType]?.spell.width!,
            this.predefinedSpellParams[spellType]?.spell.height!,
          );
          break;
        }
        case "impact": {
          this.drawFrame(
            context,
            spriteSource,
            this.predefinedSpellParams[spellType]?.impact.width! * index,
            64,
            this.predefinedSpellParams[spellType]?.impact.width!,
            this.predefinedSpellParams[spellType]?.impact.height!,
            0,
            0,
            this.predefinedSpellParams[spellType]?.impact.width!,
            this.predefinedSpellParams[spellType]?.impact.height!,
          );
          break;
        }
      }
    });
  }

  public drawTowerFrameOnCanvas(
    element: TTowerSpriteElements,
    contextArr: CanvasRenderingContext2D[],
    spriteSource: CanvasImageSource,
    towerType: TTowerTypes,
    upgradeLevel = 0,
  ) {
    this.promiseArr.push(
      new Promise((resolve, reject) => {
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
              resolve(1);
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
              resolve(1);
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
              resolve(1);
              break;
            }
            // constructionSell
            case "constructionSell": {
              this.drawFrame(
                context,
                spriteSource,
                this.predefinedTowerParams[towerType]?.towerParams
                  ?.constructionHeight! * index,
                0,
                this.predefinedTowerParams[towerType]?.towerParams
                  ?.constructionHeight,
                this.predefinedTowerParams[towerType]?.towerParams
                  ?.constructionWidth,
                0,
                0,
                this.predefinedTowerParams[towerType]?.towerParams
                  ?.constructionHeight,
                this.predefinedTowerParams[towerType]?.towerParams
                  ?.constructionWidth,
              );
              resolve(1);
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
              resolve(1);
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
                this.predefinedTowerParams[towerType]!.projectileParams
                  ?.dimensions[upgradeLevel].projectileWidth * index,
                0,
                this.predefinedTowerParams[towerType]!.projectileParams
                  ?.dimensions[upgradeLevel].projectileWidth,
                this.predefinedTowerParams[towerType]!.projectileParams
                  ?.dimensions[upgradeLevel].projectileHeight,
                (canvasHypot -
                  this.predefinedTowerParams[towerType]!.projectileParams
                    ?.dimensions[upgradeLevel].projectileWidth) /
                  2,
                (canvasHypot -
                  this.predefinedTowerParams[towerType]!.projectileParams
                    ?.dimensions[upgradeLevel].projectileHeight) /
                  2,
                this.predefinedTowerParams[towerType]!.projectileParams
                  ?.dimensions[upgradeLevel].projectileWidth,
                this.predefinedTowerParams[towerType]!.projectileParams
                  ?.dimensions[upgradeLevel].projectileHeight,
              );
              resolve(1);
              break;
            }
            // impacts
            case "impact": {
              this.drawFrame(
                context,
                spriteSource,
                this.predefinedTowerParams[towerType]?.projectileParams
                  ?.dimensions[upgradeLevel].impactWidth! * index,
                0,
                this.predefinedTowerParams[towerType]?.projectileParams
                  ?.dimensions[upgradeLevel].impactWidth!,
                this.predefinedTowerParams[towerType]?.projectileParams
                  ?.dimensions[upgradeLevel].impactHeight!,
                0,
                0,
                this.predefinedTowerParams[towerType]?.projectileParams
                  ?.dimensions[upgradeLevel].impactWidth!,
                this.predefinedTowerParams[towerType]?.projectileParams
                  ?.dimensions[upgradeLevel].impactHeight!,
              );
              resolve(1);
              break;
            }
          }
        });
      }),
    );
  }

  public draftShowSpell() {
    // can't cast spells in builing mode
    if (this.isCanBuild) return;
    if (!this.isCanCast) return;
    this.draftSpell!.spellParams.currentPosition = this.cursorPosition;
  }

  public draftSpellCast() {
    this.draftSpell!.spellParams!.collisionPoint = {
      x:
        this.draftSpell?.spellParams?.currentPosition!.x! -
        this.map?.mapParams?.gridStep! / 2,
      y:
        this.draftSpell?.spellParams?.currentPosition!.y! -
        this.map?.mapParams?.gridStep! / 2,
    };
    this.draftSpell!.spellParams!.currentPosition! = {
      x:
        this.draftSpell?.spellParams?.currentPosition!.x! -
        this.map?.mapParams?.gridStep! * 4,
      y:
        this.draftSpell?.spellParams?.currentPosition!.y! -
        this.map?.mapParams?.gridStep! * 4,
    };
    this.spells?.push(this.draftSpell!);
    this.mana -= this.draftSpell?.spellParams?.manaCost!;
    gameStore.getState().updateMana(this.mana);
    this.isCanCast = false;
    this.draftSpell = null;
  }

  public castSpell(spellType: TSpellTypes) {
    this.draftSpell = null;
    // disable building mode
    if (this.isCanBuild) {
      this.isCanBuild = false;
    }
    if (
      this.isEnoughMana(
        this.predefinedSpellParams[spellType].spellParams.manaCost,
      )
    ) {
      const collisionPoint = {
        x: this.cursorPosition.x! - this.map?.mapParams?.gridStep! / 2,
        y: this.cursorPosition.y! - this.map?.mapParams?.gridStep! / 2,
      };
      const currentPosition = {
        x: this.cursorPosition.x! - this.map?.mapParams?.gridStep! * 4,
        y: this.cursorPosition.y! - this.map?.mapParams?.gridStep! * 4,
      };
      this.isCanCast = true;
      this.draftSpell = new Spell(this, spellType, {
        collisionPoint,
        currentPosition,
        attackDamage:
          this.predefinedSpellParams[spellType].spellParams.attackDamage,
        attackRange:
          this.predefinedSpellParams[spellType].spellParams.attackRange,
        movementSpeed:
          this.predefinedSpellParams[spellType].spellParams.movementSpeed,
        manaCost: this.predefinedSpellParams[spellType].spellParams.manaCost,
      });
      this.draftSpell.spellParams = structuredClone(
        this.predefinedSpellParams[spellType].spellParams,
      );
      this.draftShowSpell();
    }
  }

  public buildTower = (
    type: TTowerTypes,
    upgradeLevel: Tower["upgradeLevel"],
  ) => {
    this.draftTower = null;
    this.isShowGrid = false;
    // disable cast mode
    if (this.isCanCast) {
      this.isCanCast = false;
    }
    if (
      this.isEnoughMoney(this.predefinedTowerParams[type]!.towerParams.price!)
    ) {
      this.clearTowerSelection();
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

  public findClosestTower(
    coordinates: ITwoDCoordinates,
    tilesArr: ITwoDCoordinates[] = this.map?.mapParams?.towerTilesArr!,
  ) {
    let closestTile: ITwoDCoordinates | undefined = undefined;
    let minDistance = this.map?.mapParams.width;
    tilesArr.forEach((tile) => {
      const distance =
        (tile.x -
          coordinates.x! +
          this.map?.mapParams?.gridStep! -
          this.map?.mapParams?.tileCenter!) *
          (tile.x -
            coordinates.x! +
            this.map?.mapParams?.gridStep! -
            this.map?.mapParams?.tileCenter!) +
        (tile.y - coordinates.y! + this.map?.mapParams?.tileCenter!) *
          (tile.y - coordinates.y! + this.map?.mapParams?.tileCenter!);
      if (distance < minDistance!) {
        minDistance = distance;
        closestTile! = tile!;
      }
    });

    return closestTile;
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
    } else if (this.draftSpell) {
      this.draftShowSpell();
    }
  };

  public canvasClickCallback = (e: MouseEvent) => {
    // build tower
    if (this.isCanBuild) {
      this.draftBuildTower();
    } else if (this.isCanCast) {
      this.draftSpellCast();
    } else {
      this.selectTower();
      if (!this.selectedTower && gameStore.getState().isBuildMenuOpen) {
        gameStore.getState().updateIsBuildMenuOpen(false);
      }
    }
  };

  public upgradeTower(tower: Tower) {
    // max upgrade level check
    if (tower.upgradeLevel === tower.towerParams.maxUpgradeLevel!) return;
    if (
      !this.isEnoughMoney(tower.towerParams.price! * (tower.upgradeLevel + 1))
    )
      return;
    // decrement money
    this.money -= tower.towerParams.price! * (tower.upgradeLevel + 1);
    // update UI
    useGameStore.getState().updateMoney(this.money);
    useGameStore.getState().updateConstructionProgress(0);
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

  public sellTower(tower: Tower) {
    // disable tower attack
    tower.isCanFire = false;
    // remove selection
    tower.towerParams.isSelected = false;
    this.clearTowerSelection(tower);
    // release tower target
    tower.target = null;
    // set render params
    tower.renderParams.constructingCurrentFrame = 0;
    tower.renderParams.isSelling = true;
    // return money to the player
    this.money += Math.floor(
      (tower.towerParams?.price! * (tower.upgradeLevel! + 1)) / 2,
    );
    gameStore.getState().updateMoney(this.money);
    // allow player to build towers on this tile again
    this.map!.mapParams.mapTilesArr!.push({
      x: tower.currentPosition.x - this.map?.mapParams?.gridStep!,
      y: tower.currentPosition.y - this.map?.mapParams?.gridStep!,
    });
  }

  public clearTowerSelection(
    tower: Tower | undefined = this.selectedTower!,
    context: CanvasRenderingContext2D = this.context?.selection!,
  ) {
    // UI close right menu
    gameStore.getState().updateIsSideMenuOpen(false);
    //
    this.clearContext(context);
    this.selectedTower = null;
    if (tower) {
      tower.towerParams.isSelected = false;
    }
  }

  public selectTower() {
    if (!this.towers?.length) return;
    const closestTile = this.findClosestTower(this.cursorPosition);
    this.towers.forEach((tower) => {
      // remove previous selection
      if (this.selectedTower === tower) {
        this.clearTowerSelection();
      }
      // set new selection
      if (closestTile) {
        if (
          tower.currentPosition.x - this.map?.mapParams?.gridStep! ===
            (closestTile! as ITwoDCoordinates).x &&
          tower.currentPosition.y - this.map?.mapParams?.gridStep! ===
            (closestTile! as ITwoDCoordinates).y
        ) {
          this.selectedTower = tower;
          // UI
          gameStore.getState().updateSelectedTower(tower);
          gameStore.getState().updateIsSideMenuOpen(true);
          this.selectedTower.towerParams.isSelected = true;
          this.clearContext(this.context?.selection!);
          this.selectedTower.drawSelection();
          return;
        }
      }
    });
  }

  public gameWindowKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (gameStore.getState().isGameStarted) {
        // exit building mode
        if (this.isCanBuild) {
          this.isCanBuild = false;
          this.isShowGrid = false;
        } else if (this.isCanCast) {
          this.isCanCast = false;
        } else if (this.selectedTower) {
          // clear selected tower
          this.clearTowerSelection();
        } else {
          // toggle game menu
          gameStore
            .getState()
            .updateIsGameMenuOpen(!gameStore.getState().isGameMenuOpen);
          // toggle build menu
          gameStore
            .getState()
            .updateIsBuildMenuOpen(!gameStore.getState().isBuildMenuOpen);
        }
      } else {
        // toggle game menu
        gameStore
          .getState()
          .updateIsGameMenuOpen(!gameStore.getState().isGameMenuOpen);
        // toggle build menu
        gameStore
          .getState()
          .updateIsBuildMenuOpen(!gameStore.getState().isBuildMenuOpen);
      }
    }

    // quick build hotkeys
    if (gameStore.getState().isGameStarted) {
      // spell
      if (e.key === "q") {
        this.castSpell("fireball");
      }
      if (e.key === "w") {
        this.castSpell("tornado");
      }
      // tower
      if (e.key === "1") {
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
    }

    if (e.key === "s") {
      if (!gameStore.getState().isGameStarted) {
        this.gameStart();
      }
    }
    if (e.key === "p") {
      if (gameStore.getState().isGameStarted) {
        this.gameStop();
      }
    }
    if (e.key === "m") {
      // game audio toggle
      if (this.sound?.soundArr?.gameStart?.paused) {
        this.sound?.soundArr?.gameStart?.play();
      } else {
        this.sound?.soundArr?.gameStart?.pause();
      }
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
  };

  public isEnoughMana(manaCost: ITDEngine["mana"]) {
    if (this.mana >= manaCost) {
      return true;
    }
    this.isNotEnoughMana = true;
    return false;
  }

  public isEnoughMoney(towerPrice: ITDEngine["money"]) {
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

          // clear the map behind the tower to clear stones trees etc
          this.map?.drawEmptyBackgroundTile(this.draftBuildCoordinates);

          // set strokeStyle to default
          this.draftTower!.towerParams.strokeStyle =
            this.initialGameParams.strokeStyle;

          // set tower is constructing flag
          this.draftTower!.renderParams.isConstructing = true;

          // add new tower
          this.towers?.push(this.draftTower!);

          // sort towers by y coordinate to proper drawing
          this.towers = this.towers?.sort(
            (a, b) => a.currentPosition.y - b.currentPosition.y,
          );

          // push tile to towerTilesArr
          this.map!.mapParams.towerTilesArr.push({
            x: this.draftBuildCoordinates.x - this.map?.mapParams?.gridStep!,
            y: this.draftBuildCoordinates.y - this.map?.mapParams?.gridStep!,
          });

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
          gameStore.getState().updateMoney(this.money);
          this.draftTower = null;
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
    if (this.enemies?.length) {
      this.clearContext(this.context!.enemy!);
    }
    this.clearContext(this.context!.deadEnemy!);
    this.clearContext(this.context!.spell!);
    this.clearContext(this.context!.spellDraft!);
    // this.clearContext(this.context.tower!);
  }

  public pushProjectile(projectile: Projectile) {
    this.projectiles?.push(projectile);
  }

  public gameLoop = () => {
    setTimeout(() => {
      // game start
      if (gameStore.getState().isGameStarted) {
        if (this.lives > 0) {
          // clear canvas
          this.clearCanvas();

          // build mode
          if (this.isCanBuild) {
            if (this.draftTower) {
              this.draftTower.drawDraft();
            }
          }

          // cast spell mode
          if (this.isCanCast) {
            if (this.draftSpell) {
              this.draftSpell.drawDraft();
            }
          }

          // draw enemies
          if (this.enemies?.length) {
            this.enemies?.forEach((enemy: Enemy) => {
              if (enemy.renderParams.isAnimateDeath) return;
              if (enemy.currentPosition.x + enemy.enemyParams.width! < 0)
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
              } else if (tower.renderParams.isSelling) {
                tower.drawSelling();
              } else {
                tower.drawCannon(this.context!.cannon!);
              }
            });
          }

          // draw spells
          if (this.spells?.length) {
            this.spells?.forEach((spell: Spell) => {
              spell.draw();
            });
          }

          // highlight the closest map tile to the cursor
          // this.highlightTile(this.map!.mapParams.closestTile);
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
      if (gameStore.getState().isGameStarted) {
        // enemy init || move
        if (!this.waveGenerator?.isInitialized) {
          if (!this.waveGenerator?.waveTimerBetweenWaves) {
            // UI countdown between waves
            gameStore
              .getState()
              .updateCountdown(
                Math.floor(this.waveGenerator!.waveTimeoutBetweenWaves / 1000),
              );
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
            gameStore
              .getState()
              .updateCountdown(this.waveGenerator!.waveCountdown);
            if (!this.waveGenerator.waveTimerBetweenWaves) {
              // UI countdown between waves
              this.waveGenerator.waveCountdownTimer = setInterval(() => {
                if (this.waveGenerator!.waveCountdown > 0) {
                  this.waveGenerator!.waveCountdown -= 1;
                  gameStore
                    .getState()
                    .updateCountdown(this.waveGenerator!.waveCountdown);
                } else {
                  clearInterval(this.waveGenerator?.waveCountdownTimer!);
                  gameStore.getState().updateCountdown(0);
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
            if (
              tower.renderParams.isConstructing ||
              tower.renderParams.isSelling
            )
              return;
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

        // move spells
        if (this.spells?.length) {
          this.spells?.forEach((spell: Spell) => {
            if (spell.renderParams.isMoving) {
              spell.move();
            }
          });
        }

        // increment mana parameter
        if (this.mana < this.initialGameParams.mana && this.mana >= 0) {
          if (!this.manaIncrementTimer) {
            this.manaIncrementTimer = setInterval(() => {
              this.mana += this.manaIncrementQuantity;
              gameStore.getState().updateMana(this.mana);
            }, this.manaIncrementTimeout);
          }
        } else {
          clearInterval(this.manaIncrementTimer!);
          this.manaIncrementTimer = null;
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
      gameStore.getState().updateIsGameStarted(false);
      gameStore.getState().updateIsGameOver(true);
      this.isGameOver = true;
    }
  };
}
