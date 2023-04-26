import { Enemy } from "../enemies/Enemy";
import { Tower } from "../towers/Tower";
import { Map } from "../maps/Map";
import { Projectile } from "../projectiles/Projectile";
import { Sound } from "@/pages/Game/sound/Sound";
import { useGameStore as gameStore, useUserStore } from "@/store";
import { ISpell, Spell } from "@/pages/Game/spells/Spell";
import { WaveGenerator } from "@/pages/Game/waveGenerator/waveGenerator";
import {
  ILeaderboardPostBody,
  useLeaderboardStore,
} from "@/store/LeaderboardStore";

// utilities declaration
export type TPartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

// screen size
export type TScreenSize = "widescreen" | "tablet" | "phone";

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
  | "towerRange"
  | "enemy"
  | "deadEnemy"
  | "map"
  | "mapDecorations"
  | "mapBackground";
export type TTowerTypes =
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight";
export type TSpellTypes = "fireball" | "tornado" | "water" | "rock";
export type TEnemyType =
  | "firebug"
  | "leafbug"
  | "magmacrab"
  | "scorpion"
  | "clampbeetle"
  | "firelocust"
  | "butterfly";
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

export const ColorDict = {
  tileSelectionColor: "#01FFE9",
  defauiltStrokeColor: "#000000",
  borderColor: "#bd6a62",
  sandColor: "#ffae70",
  fontColor: "#262626",
  shadowColor: "#444444",
  towerRangeColor: "green",
  spellRangeColor: "blue",
  specialAttackslowColor: "#b739d7",
  specialAttackshockColor: "#975b1c",
  specialAttackpoisonColor: "#39ffad",
  specialAttacksplashColor: "#ff6e6e",
  specialAttackfreezeColor: "blue",
  specialAttackspellColor: "white",
} as const;

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
  description?: string;
}

export interface ITwoDCoordinates {
  x: number;
  y: number;
}

export interface ITDEngine {
  context?: TPartialRecord<TEngineCanvas, CanvasRenderingContext2D>;
  gameWindow?: HTMLElement | null;
  enemies?: Enemy[];
  towers?: Tower[];
  projectiles?: Projectile[];
  spells?: Spell[];
  map?: Map | null;
  animationFrameId: number;
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
  promiseArr: Promise<string | number>[];
  viewport: TScreenSize;
  boolean: boolean;
  demoTimeoutArr: NodeJS.Timer[];
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
        description?: string;
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
    maxMoney: number;
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
    cleanTilePrice: number;
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
    public lives: ITDEngine["lives"] = 0,
    public score: ITDEngine["score"] = 0,
    public money: ITDEngine["money"] = 0,
    public mana: ITDEngine["mana"] = 100,
    public manaIncrementQuantity: ITDEngine["manaIncrementQuantity"] = 2,
    public manaIncrementTimer: ITDEngine["manaIncrementTimer"] = null,
    public manaIncrementTimeout: ITDEngine["manaIncrementTimeout"] = 2200,
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
      towerRange: 31,
      enemy: 30,
      deadEnemy: 20,
      mapDecorations: 13,
      mapBackground: 12,
      map: 11,
    } as const,
    public isDemo: ITDEngine["boolean"] = false,
    public demoTimeoutArr: ITDEngine["demoTimeoutArr"] = [],
    public isInitialized: ITDEngine["boolean"] = false,
    public promiseArr: ITDEngine["promiseArr"] = [],
    public viewport: ITDEngine["viewport"] = "widescreen",
    public isCanvasCreated: ITDEngine["boolean"] = false,
    public isCanBuild: ITDEngine["boolean"] = false,
    public isCanCast: ITDEngine["boolean"] = false,
    public isCanClean: ITDEngine["boolean"] = false,
    public isGameStarted: ITDEngine["boolean"] = false,
    public isGameOver: ITDEngine["boolean"] = false,
    public isShowGrid: ITDEngine["boolean"] = false,
    public isCheatMode: ITDEngine["boolean"] = false,
    public isNotEnoughMoney: ITDEngine["boolean"] = false,
    public isNotEnoughMana: ITDEngine["boolean"] = false,
    public isSoundEnabled: ITDEngine["boolean"] = true,
    public draftSpell: ITDEngine["draftSpell"] = null,
    public randomSpell: ITDEngine["draftSpell"] = null,
    public draftTower: ITDEngine["draftTower"] = null,
    public selectedTower: ITDEngine["selectedTower"] = null,
    public cursorPosition: ITDEngine["cursorPosition"] = { x: 0, y: 0 },
    public draftBuildCoordinates: ITwoDCoordinates = { x: 0, y: 0 },
    public towerAngleOffset: number = Math.PI / 2.75,
    public cheatString: string = "",
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
      water: {
        spriteSourcePath: "waterSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      rock: {
        spriteSourcePath: "rockSprite.png",
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
      five: {
        spriteSourcePath: {
          base: "towerFiveBase.png",
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
            "towerFiveLevelOneImpact.png",
            "towerFiveLevelTwoImpact.png",
            "towerFiveLevelThreeImpact.png",
          ],
          weapon: [
            "towerFiveLevelOneWeapon.png",
            "towerFiveLevelTwoWeapon.png",
            "towerFiveLevelThreeWeapon.png",
          ],
          projectile: [
            "towerFiveLevelOneProjectile.png",
            "towerFiveLevelTwoProjectile.png",
            "towerFiveLevelThreeProjectile.png",
          ],
        },
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      six: {
        spriteSourcePath: {
          base: "towerSixBase.png",
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
            "towerSixLevelOneImpact.png",
            "towerSixLevelTwoImpact.png",
            "towerSixLevelThreeImpact.png",
          ],
          weapon: [
            "towerSixLevelOneWeapon.png",
            "towerSixLevelTwoWeapon.png",
            "towerSixLevelThreeWeapon.png",
          ],
          projectile: [
            "towerSixLevelOneProjectile.png",
            "towerSixLevelTwoProjectile.png",
            "towerSixLevelThreeProjectile.png",
          ],
        },
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      seven: {
        spriteSourcePath: {
          base: "towerSevenBase.png",
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
            "towerSevenLevelOneImpact.png",
            "towerSevenLevelTwoImpact.png",
            "towerSevenLevelThreeImpact.png",
          ],
          weapon: [
            "towerSevenLevelOneWeapon.png",
            "towerSevenLevelTwoWeapon.png",
            "towerSevenLevelThreeWeapon.png",
          ],
          projectile: [
            "towerSevenLevelOneProjectile.png",
            "towerSevenLevelTwoProjectile.png",
            "towerSevenLevelThreeProjectile.png",
          ],
        },
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
      },
      eight: {
        spriteSourcePath: {
          base: "towerEightBase.png",
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
            "towerEightLevelOneImpact.png",
            "towerEightLevelTwoImpact.png",
            "towerEightLevelThreeImpact.png",
          ],
          weapon: [
            "towerEightLevelOneWeapon.png",
            "towerEightLevelTwoWeapon.png",
            "towerEightLevelThreeWeapon.png",
          ],
          projectile: [
            "towerEightLevelOneProjectile.png",
            "towerEightLevelTwoProjectile.png",
            "towerEightLevelThreeProjectile.png",
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
        description:
          "обычный враг, средняя скорость, средний показатель здоровья",
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
        description: "скорость ниже среднего, увеличенное количество здоровья",
      },
      magmacrab: {
        spriteSourcePath: "magmacrabSprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteRightRow: 6,
        spriteLeftRow: 5,
        spriteUpRow: 4,
        spriteDownRow: 7,
        framesPerSprite: 8,
        deathFramesPerSprite: 10,
        description:
          "обычный враг, средняя скорость, средний показатель здоровья",
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
        description:
          "бронированный враг. здоровье выше среднего, все остальные параметры средние",
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
        description:
          "быстрый враг. больше скорость перемещения, меньше здоровья",
      },
      butterfly: {
        spriteSourcePath: "butterflySprite.png",
        spriteSource: null,
        canvasArr: null,
        canvasContextArr: null,
        spriteRightRow: 6,
        spriteLeftRow: 7,
        spriteUpRow: 5,
        spriteDownRow: 4,
        framesPerSprite: 8,
        deathFramesPerSprite: 12,
        description: "самый быстрый враг. здоровье значительно ниже среднего",
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
        description: "босс. много здоровья, сопротивление магическим эффектам",
      },
    },
    public predefinedSpellParams: ITDEngine["predefinedSpellParams"] = {
      fireball: {
        spell: {
          framesPerSprite: 10,
          width: 64,
          height: 64,
          description: `Огненный шар - поражает врагов в небольшой области, быстро летит и наносит средний урон`,
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
          movementSpeed: 8,
          spellDirection: "left",
        },
      },
      tornado: {
        spell: {
          framesPerSprite: 10,
          width: 64,
          height: 64,
          description: `Ураган - наносит небольшой урон и заметно замедляет противников в небольшой области. Мгновенное применение`,
        },
        impact: {
          framesPerSprite: 9,
          width: 64,
          height: 64,
        },
        spellParams: {
          attackRange: 140,
          attackDamage: 10,
          attackModifier: "slow",
          attackModifierTimeout: 3000,
          attackModifierStrength: 0.8,
          manaCost: 15,
          movementSpeed: 4,
          spellDirection: "left",
        },
      },
      water: {
        spell: {
          framesPerSprite: 10,
          width: 64,
          height: 64,
          description: `Водопад - медленно летит, наносит небольшой урон и надолго, но незначительно замедляет врагов в большой области`,
        },
        impact: {
          framesPerSprite: 5,
          width: 64,
          height: 64,
        },
        spellParams: {
          attackRange: 200,
          attackDamage: 5,
          attackModifier: "slow",
          attackModifierTimeout: 10000,
          attackModifierStrength: 0.2,
          manaCost: 10,
          movementSpeed: 4,
          spellDirection: "down",
        },
      },
      rock: {
        spell: {
          framesPerSprite: 10,
          width: 64,
          height: 64,
          description: `Камнепад, который надолго оглушает врагов в очень маленькой области и наносит небольшой урон`,
        },
        impact: {
          framesPerSprite: 5,
          width: 64,
          height: 64,
        },
        spellParams: {
          attackRange: 50,
          attackDamage: 10,
          attackModifier: "shock",
          attackModifierTimeout: 3000,
          manaCost: 25,
          movementSpeed: 4,
          spellDirection: "down",
        },
      },
    },
    public predefinedTowerParams: ITDEngine["predefinedTowerParams"] = {
      one: {
        towerParams: {
          attackRate: 900,
          attackDamage: 16,
          attackRange: 220,
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
          strokeStyle: ColorDict.towerRangeColor,
          maxUpgradeLevel: 2,
          price: 25,
          description:
            "Средняя скорость атаки, но с средний урон башни со стрелами. Средний радиус атаки.",
        },
        projectileParams: {
          acceleration: 1.5,
          projectileSpeed: 2,
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
          attackRate: 1500,
          attackDamage: 8,
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
          strokeStyle: ColorDict.towerRangeColor,
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
          price: 35,
          description:
            "Быстрые, но наносящие мало урона башни с молнией. Оглушают врага на короткий промежуток времени. Радиус атаки меньше среднего.",
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 4,
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
          attackModifierTimeout: 700,
        },
      },
      three: {
        towerParams: {
          attackRate: 1000,
          attackDamage: 5,
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
          strokeStyle: ColorDict.towerRangeColor,
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
          price: 55,
          description:
            "Cредние по скорости атаки, но отравляющие врагов башни с рогаткой. Радиус атаки больше среднего.",
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 3,
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
          attackRate: 5000,
          attackDamage: 65,
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
          strokeStyle: ColorDict.towerRangeColor,
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
          price: 65,
          description:
            "Медленные, но атакующие сплешем (всех врагов в небольшом радиусе) башни с молотом. Маленький радиус атаки.",
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 4,
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
      five: {
        towerParams: {
          attackRate: 5000,
          attackDamage: 0,
          attackRange: 240,
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
          cannonFrameLimit: 29,
          strokeStyle: ColorDict.towerRangeColor,
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
          price: 55,
          description:
            "Магическая башня с рунами. Произносит случайное заклинание с увеличенным уроном по цели в радиусе действия башни.",
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 4,
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
              projectileWidth: 96,
              projectileHeight: 96,
              impactWidth: 96,
              impactHeight: 96,
            },
          ],
          projectileFrameLimit: 12,
          impactFrameLimit: 10,
          attackModifier: "spell",
        },
      },
      six: {
        towerParams: {
          attackRate: 4000,
          attackDamage: 25,
          attackRange: 400,
          baseWidth: 64,
          baseHeight: 128,
          constructionWidth: 192,
          constructionHeight: 256,
          constructionFrameLimit: 6,
          constructionSellFrameLimit: 13,
          dimensions: [
            {
              cannonWidth: 64,
              cannonHeight: 64,
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
          cannonFrameLimit: 6,
          strokeStyle: ColorDict.towerRangeColor,
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
          price: 45,
          description:
            "Дальнобойные башни с быстрой скоростью полета снаряда, обычный урон",
        },
        projectileParams: {
          acceleration: 2,
          projectileSpeed: 6,
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
          projectileFrameLimit: 8,
          impactFrameLimit: 9,
        },
      },
      seven: {
        towerParams: {
          attackRate: 12000,
          attackDamage: 45,
          attackRange: 500,
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
              cannonWidth: 48,
              cannonHeight: 48,
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
          cannonFrameLimit: 10,
          strokeStyle: ColorDict.towerRangeColor,
          firingAngle: towerAngleOffset,
          fireFromCoords: { x: 0, y: 0 },
          maxUpgradeLevel: 2,
          price: 145,
          description:
            "Очень медленные, но самые дальнобойные башни с большим сплешем",
        },
        projectileParams: {
          acceleration: 1.2,
          projectileSpeed: 4,
          dimensions: [
            {
              projectileWidth: 64,
              projectileHeight: 64,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 64,
              projectileHeight: 64,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 64,
              projectileHeight: 64,
              impactWidth: 64,
              impactHeight: 64,
            },
          ],
          projectileFrameLimit: 7,
          impactFrameLimit: 6,
          attackModifier: "splash",
          attackModifierRange: 200,
        },
      },
      eight: {
        towerParams: {
          attackRate: 3000,
          attackDamage: 8,
          attackRange: 200,
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
          strokeStyle: ColorDict.towerRangeColor,
          maxUpgradeLevel: 2,
          price: 65,
          description:
            "Средняя скорость атаки, небольшой урон, поражает цели ядом, который наносит урон в течении времени",
        },
        projectileParams: {
          acceleration: 1.5,
          projectileSpeed: 2,
          rectCenterX: 0,
          rectCenterY: 0,
          dimensions: [
            {
              projectileWidth: 6,
              projectileHeight: 26,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 16,
              projectileHeight: 34,
              impactWidth: 64,
              impactHeight: 64,
            },
            {
              projectileWidth: 10,
              projectileHeight: 37,
              impactWidth: 64,
              impactHeight: 64,
            },
          ],
          projectileFrameLimit: 3,
          impactFrameLimit: 6,
          attackModifier: "poison",
          attackModifierTimeout: 5000,
          attackModifierDPS: 4,
        },
      },
    },

    public initialGameParams: ITDEngine["initialGameParams"] = {
      maxMoney: 999,
      money: 130,
      mana: 100,
      lives: 10,
      wave: 1,
      enemiesPerWave: 20,
      endWave: 10,
      hpCoefficient: 50,
      speedCoefficient: 2,
      strokeStyle: ColorDict.defauiltStrokeColor,
      framesPerSprite: 8,
      fps: 24,
      cleanTilePrice: 25,
    },
    public waveGenerator: ITDEngine["waveGenerator"] = null,
    public sound: ITDEngine["sound"] = new Sound(),
  ) {
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
          newCanvas.style.outline = "none";
          newCanvas.tabIndex = 2;
        } else if (canvasId === "spellDraft" || canvasId === "towerRange") {
          newCanvas.style.opacity = "0.4";
        } else if (canvasId === "map") {
          /* newCanvas.style.background = `url("${this.map?.grassBackrgroundCanvas?.toDataURL()}") repeat`; */
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

      // return success
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

  public castRandomSpell = (
    enemy: Enemy | null = null,
    tower: Tower | null = null,
  ) => {
    const spellTypesArr: TSpellTypes[] = [
      "fireball",
      "tornado",
      "water",
      "rock",
    ];
    if (
      this.enemies?.length &&
      this.waveGenerator?.waveParams?.isWaveInProgress
    ) {
      const spellType: TSpellTypes =
        spellTypesArr[Math.floor(Math.random() * spellTypesArr.length)];
      let spellPosition = { x: 0, y: 0 };
      // enemy and tower is set
      if (enemy && tower) {
        spellPosition = enemy.currentPosition;
      } else {
        const visibleEnemies = this.enemies.filter(
          (enemyParam) =>
            enemyParam.currentPosition.x > this.map?.tileToNumber(1)! &&
            enemyParam.currentPosition.x <
              this.map?.tileToNumber(this.map?.mapParams?.widthTile - 1)!,
        );
        if (visibleEnemies.length) {
          spellPosition =
            visibleEnemies[Math.floor(Math.random() * visibleEnemies.length)]
              .currentPosition;
        } else {
          return;
        }
      }
      const collisionPoint = {
        x:
          spellPosition.x! -
          this.predefinedSpellParams[spellType].spell.width / 2,
        y:
          spellPosition.y! -
          this.predefinedSpellParams[spellType].spell.height / 2,
      };
      const currentPosition = {
        x:
          this.predefinedSpellParams[spellType].spellParams.spellDirection ===
          "left"
            ? spellPosition.x! - this.map?.mapParams?.gridStep! * 4
            : collisionPoint.x!,
        y: spellPosition.y! - this.map?.mapParams?.gridStep! * 4,
      };
      // create spell draft
      this.randomSpell = new Spell(this, spellType, {
        attackDamage:
          this.predefinedSpellParams[spellType].spellParams.attackDamage,
        attackRange:
          this.predefinedSpellParams[spellType].spellParams.attackRange,
        movementSpeed:
          this.predefinedSpellParams[spellType].spellParams.movementSpeed,
        manaCost: this.predefinedSpellParams[spellType].spellParams.manaCost,
        spellDirection:
          this.predefinedSpellParams[spellType].spellParams.spellDirection,
      });
      this.randomSpell.spellParams = structuredClone(
        this.predefinedSpellParams[spellType].spellParams,
      );
      // modify spell params by tower level
      if (tower && tower.upgradeLevel) {
        this.randomSpell.spellParams.movementSpeed *= 2 * tower?.upgradeLevel;
        this.randomSpell.spellParams.attackDamage *= 2 * tower?.upgradeLevel;
      }
      this.randomSpell.spellParams.currentPosition = currentPosition;
      this.randomSpell.spellParams.collisionPoint = collisionPoint;
      // cast a spell
      this.spells?.push(this.randomSpell!);
      this.randomSpell = null;
    }
  };

  public startDemo() {
    gameStore.getState().updateIsGameStarted(true);
    // set game params
    this.lives = 10000;
    this.money = 10000;
    this.mana = 10000;
    this.waveGenerator!.waveParams!.endWave = 100;
    // set demo stage timeouts
    const demoStageTimeout = {
      enemiesSpawn: 1000,
      buildTowers: 3000,
      updateTower: 20000,
      spellCast: 5000,
    };
    // slice tiles to build in demo mode
    let demoBuildTilesArr = this.map?.mapParams?.mapTilesArr.filter(
      (tile) =>
        tile.y <= this.map?.tileToNumber(4)! &&
        tile.y > this.map?.tileToNumber(2)!,
    );
    // make tower types arr
    const towerTypesArr: TTowerTypes[] = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
    ];
    const getRandomTile = (arr: ITwoDCoordinates[]) => {
      const tile = arr!
        .sort(() => Math.random() - Math.random())
        .slice(0, arr!.length)[0];
      // pop this tile
      demoBuildTilesArr = demoBuildTilesArr?.filter(
        (tileParam) => tileParam.x !== tile.x || tileParam.y !== tile.y,
      );
      return {
        x: tile.x + this.map?.mapParams?.gridStep!,
        y: tile.y + this.map?.mapParams?.gridStep!,
      };
    };

    const buildRandomTower = () => {
      const buildTile = getRandomTile(demoBuildTilesArr!);
      const towerType: TTowerTypes =
        towerTypesArr[Math.floor(Math.random() * towerTypesArr.length)];
      // make new tower
      this.draftTower = new Tower(
        this,
        towerType,
        0,
        buildTile,
        structuredClone(this.predefinedTowerParams[towerType]?.towerParams!),
        structuredClone(
          this.predefinedTowerParams[towerType]?.projectileParams!,
        ),
      );
      // and build it
      this.draftTower!.renderParams.isConstructing = true;
      this.towers?.push(this.draftTower);
      // clear draft tower
      this.draftTower = null;
    };

    const buildRandomTowers = () => {
      buildRandomTower();
      this.demoTimeoutArr.push(
        setTimeout(buildRandomTower, Math.floor(Math.random() * 10000)),
      );
      this.demoTimeoutArr.push(
        setTimeout(buildRandomTower, Math.floor(Math.random() * 20000)),
      );
      this.demoTimeoutArr.push(
        setTimeout(buildRandomTower, Math.floor(Math.random() * 30000)),
      );
      this.demoTimeoutArr.push(
        setTimeout(buildRandomTower, Math.floor(Math.random() * 40000)),
      );
    };

    // emulate user game actions by random timeouts
    // start game and spawn enemies
    this.demoTimeoutArr.push(
      setTimeout(() => {
        this.waveGenerator = new WaveGenerator(this);
        this.waveGenerator.init();
        this.gameStart();
      }, demoStageTimeout.enemiesSpawn),
    );
    // build random towers
    this.demoTimeoutArr.push(
      setTimeout(() => {
        buildRandomTowers();
      }, demoStageTimeout.buildTowers),
    );
    // update random tower
    this.demoTimeoutArr.push(
      setInterval(() => {
        const readyForUpgradeTowerArray = this.towers?.filter(
          (tower) =>
            tower.renderParams.isConstructing !== true ||
            tower.renderParams.isConstructionEnd !== true,
        );
        const tower =
          readyForUpgradeTowerArray![
            Math.floor(Math.random() * this.towers?.length!)
          ];
        this.upgradeTower(tower);
        this.clearContext(this.context!.towerRange!);
      }, demoStageTimeout.updateTower),
    );
    // cast random spell
    this.demoTimeoutArr.push(
      setInterval(() => {
        this.castRandomSpell();
      }, demoStageTimeout.spellCast),
    );
  }

  public reload() {
    const {
      updateIsGameStarted,
      updateIsGameMenuOpen,
      updateMoney,
      updateMana,
      updateLives,
      updateEnemiesLeft,
      updateWaveNumber,
    } = gameStore.getState();
    // disable music
    this.sound?.soundArr?.gameStart?.pause();
    updateIsGameMenuOpen(true);
    updateIsGameStarted(false);
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
    this.lives = this.initialGameParams.lives;
    this.money = this.initialGameParams.money;
    this.mana = this.initialGameParams.mana;
    // UI Update
    updateLives(this.lives);
    updateMoney(this.money);
    updateMana(this.mana);
    updateEnemiesLeft(0);
    updateWaveNumber(0);
    this.isDemo = false;
    this.map = null;
    this.isCanvasCreated = false;
    this.isDemo = false;
    this.isInitialized = false;
    this.gameWindow = null;
    this.enemies = [];
    this.deadEnemies = [];
    this.towers = [];
    this.projectiles = [];
    this.spells = [];
    this.waveGenerator = new WaveGenerator(this);
    this.isGameStarted = false;
    this.demoTimeoutArr.forEach((timer) => clearTimeout(timer));
    this.demoTimeoutArr = [];
    this.draftSpell = null;
    this.draftTower = null;
  }

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
    this.clearContext(this.context!.enemy!);
    this.clearContext(this.context!.hpBar!);
    this.clearContext(this.context!.projectile!);
    this.clearContext(this.context!.spell!);
    this.clearContext(this.context!.deadEnemy!);
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
    const {
      updateMoney,
      updateMana,
      updateLives,
      updateScore,
      updateWaveNumber,
      updateEnemiesLeft,
      updateIsGameOver,
    } = gameStore.getState();
    updateMoney(this.initialGameParams.money);
    updateMana(this.initialGameParams.mana);
    updateLives(this.initialGameParams.lives);
    updateScore(this.score);
    updateWaveNumber(1);
    updateEnemiesLeft(this.enemies.length);
    updateIsGameOver(false);
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
      if (!this.animationFrameId) {
        this.gameLoop();
      }
      // add event listeners
      this.addEventListeners();
      // game start play sound
      if (this.isSoundEnabled && !this.isDemo) {
        this.sound?.soundArr?.gameStart?.play();
      }
      // close game menu if opened
      if (gameStore.getState().isGameMenuOpen) {
        gameStore.getState().updateIsGameMenuOpen(false);
      }
    }
  }

  public gameStop() {
    if (gameStore.getState().isGameStarted) {
      gameStore.getState().updateIsGameStarted(false);
    } else {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
      // remove event listeners
      this.removeEventListeners();

      // game start pause sound
      if (this.isSoundEnabled) {
        this.sound?.soundArr?.gameStart?.pause();
      }
      // close game menu if opened
      if (gameStore.getState().isGameMenuOpen && !this.isDemo) {
        gameStore.getState().updateIsGameMenuOpen(false);
      }
    }
  }

  public clearMemory() {
    this.enemies = [];
    this.deadEnemies = [];
    this.clearContext(this.context!.deadEnemy!);
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
          this.predefinedTowerParams[towerType]?.towerParams
            ?.cannonFrameLimit! + 1,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.cannonFrameLimit! + 1,
        )!,
        this.createCanvasArr(
          this.predefinedTowerParams[towerType]?.towerParams
            ?.cannonFrameLimit! + 1,
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
              const canvasHypot = Math.ceil(
                Math.hypot(
                  this.predefinedTowerParams[towerType]!.towerParams
                    ?.dimensions[level]!.cannonWidth,
                  this.predefinedTowerParams[towerType]!.towerParams
                    ?.dimensions[level]!.cannonHeight,
                ),
              );
              canvas.width = canvasHypot;
              canvas.height = canvasHypot;
              contextArr!.weapon[level]!.imageSmoothingEnabled = false;
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
              // find the widest or longest value of projectile canvas depending on firing angle
              const canvasHypot = Math.ceil(
                Math.hypot(
                  this.predefinedTowerParams[towerType]!.towerParams
                    ?.dimensions[upgradeLevel].cannonWidth,
                  this.predefinedTowerParams[towerType]!.towerParams
                    ?.dimensions[upgradeLevel].cannonHeight,
                ),
              );
              //
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
                (canvasHypot -
                  this.predefinedTowerParams[towerType]!.towerParams
                    ?.dimensions[upgradeLevel].cannonWidth) /
                  2,
                (canvasHypot -
                  this.predefinedTowerParams[towerType]!.towerParams
                    ?.dimensions[upgradeLevel].cannonHeight) /
                  2,
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
        this.draftSpell?.spellParams?.spellDirection === "left"
          ? this.draftSpell?.spellParams?.currentPosition!.x! -
            this.map?.mapParams?.gridStep! * 4
          : this.draftSpell!.spellParams!.collisionPoint.x,
      y:
        this.draftSpell?.spellParams?.currentPosition!.y! -
        this.map?.mapParams?.gridStep! * 4,
    };
    this.spells?.push(this.draftSpell!);
    this.mana -= this.draftSpell?.spellParams?.manaCost!;
    if (!this.isDemo) {
      gameStore.getState().updateMana(this.mana);
    }
    this.isCanCast = false;
    this.draftSpell = null;
    /*
    // clear spell canvas
    this.clearContext(this.context!.spell!);
    this.clearContext(this.context!.spellDraft!);
     */
  }

  public cleanTile() {
    if (!this.isEnoughMoney(this.initialGameParams.cleanTilePrice)) return;
    if (this.isCanBuild) {
      this.isCanBuild = false;
      this.draftTower = null;
      // clear build canvas
      this.clearContext(this.context?.build!);
    } else if (this.isCanCast) {
      this.isCanCast = false;
      this.draftSpell = null;
      // clear spell canvas
      this.clearContext(this.context?.spellDraft!);
      this.clearContext(this.context?.spell!);
    }
    this.isCanClean = true;
    const tile = this.findClosestTile(
      this.cursorPosition,
      this.map?.mapParams?.obstacleTilesArr,
    )!;
    if (tile) {
      this.highlightTile(tile, true);
    } else {
      this.highlightTile(this.findClosestBuildTile(this.cursorPosition), false);
    }
  }

  public draftCleanTile() {
    const tile = this.findClosestTile(
      this.cursorPosition,
      this.map?.mapParams?.obstacleTilesArr,
    )!;
    if (tile) {
      this.isCanClean = false;
      // clear background decorations tile
      this.map?.drawEmptyBackgroundTile(tile);
      // pop tile from obstacles arr
      this.map!.mapParams!.obstacleTilesArr =
        this.map?.mapParams?.obstacleTilesArr.filter(
          (obstacleTile) => tile !== obstacleTile,
        )!;
      // push tile to build allowed tiles
      this.map?.mapParams?.mapTilesArr.push(tile);
      // decrement money
      this.money -= this.initialGameParams.cleanTilePrice;
      gameStore.getState().updateMoney(this.money);
    }
  }

  public castSpell(spellType: TSpellTypes) {
    this.draftSpell = null;
    // disable building mode
    if (this.isCanBuild) {
      this.isCanBuild = false;
      // clear build canvas
      this.clearContext(this.context?.build!);
    } else if (this.isCanClean) {
      this.isCanClean = false;
    } else {
      /*
      // clear spell canvas
      this.clearContext(this.context?.spellDraft!);
      this.clearContext(this.context?.spell!);
       */
    }
    if (
      this.isEnoughMana(
        this.predefinedSpellParams[spellType].spellParams.manaCost,
      )
    ) {
      const collisionPoint = {
        x:
          this.cursorPosition.x! -
          this.predefinedSpellParams[spellType].spell.width / 2,
        y:
          this.cursorPosition.y! -
          this.predefinedSpellParams[spellType].spell.height / 2,
      };
      const currentPosition = {
        x:
          this.predefinedSpellParams[spellType].spellParams.spellDirection ===
          "left"
            ? this.cursorPosition.x! - this.map?.mapParams?.gridStep! * 4
            : collisionPoint.x!,
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
        spellDirection:
          this.predefinedSpellParams[spellType].spellParams.spellDirection,
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
      // clear spell canvas
      this.clearContext(this.context?.spellDraft!);
      this.clearContext(this.context?.spell!);
    } else if (this.isCanClean) {
      this.isCanClean = false;
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
    } else {
      this.isCanBuild = false;
    }
  };

  public findClosestBuildTile(
    coordinates: ITwoDCoordinates,
    tilesArr: ITwoDCoordinates[] = this.map?.mapParams?.mouseOverTilesArr!,
  ) {
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

    return this.map?.mapParams.closestTile!;
  }

  public findClosestTile(
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
    drawShowel: boolean = false,
    context: CanvasRenderingContext2D = this.context!.game!,
  ) {
    context.beginPath();
    context.strokeStyle = ColorDict.tileSelectionColor;
    if (drawShowel) {
      context.drawImage(this.map?.showelCanvas!, coords.x, coords.y);
    }
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
    if (this.isCanBuild || this.isCanCast || this.isCanClean) {
      this.gameWindow!.style.cursor = "none";
    } else {
      this.gameWindow!.style.cursor = "inherit";
    }

    this.cursorPosition = {
      x: e.offsetX,
      y: e.offsetY,
    };

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
    } else if (this.isCanClean) {
      this.draftCleanTile();
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
    gameStore.getState().updateMoney(this.money);
    gameStore.getState().updateConstructionProgress(0);
    tower.isCanFire = false;
    // release tower target
    tower.target = null;
    clearInterval(tower.attackIntervalTimer!);
    tower.attackIntervalTimer = null;
    // upgrade tower params by level
    tower.upgradeLevel += 1;
    tower.towerParams.attackDamage = Math.floor(
      tower.towerParams.attackDamage * 1.25,
    );
    tower.towerParams.attackRange = Math.floor(
      tower.towerParams.attackRange * 1.1,
    );
    tower.towerParams.attackRate = Math.floor(
      tower.towerParams.attackRate * 0.9,
    );
    if (tower.projectileParams.attackModifier === "poison") {
      tower.projectileParams.attackModifierDPS += tower.upgradeLevel * 2;
    }
    // clear and redraw towerRange
    // this.clearContext(this.context?.towerRange!);
    // set render params
    tower.renderParams.constructionTimeout = tower.upgradeLevel
      ? tower.renderParams.constructionTimeout * tower.upgradeLevel
      : tower.renderParams.constructionTimeout;
    tower.renderParams.isConstructing = true;

    tower.drawTowerRange(this.context?.towerRange!);
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
    this.clearContext(this.context?.towerRange!);
    this.selectedTower = null;
    if (tower) {
      tower.towerParams.isSelected = false;
    }
  }

  public selectTower() {
    if (!this.towers?.length) return;
    const closestTile = this.findClosestTile(this.cursorPosition);
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
          this.clearContext(this.context?.towerRange!);
          this.selectedTower.drawTowerRange(this.context?.towerRange!);
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
          // clear tower canvas
          this.clearContext(this.context?.build!);
          this.isCanBuild = false;
          this.isShowGrid = false;
        } else if (this.isCanCast) {
          // clear spell canvas
          this.clearContext(this.context?.spellDraft!);
          this.clearContext(this.context?.spell!);
          this.isCanCast = false;
        } else if (this.isCanClean) {
          // clear tile mode
          this.isCanClean = false;
        } else if (this.selectedTower) {
          // clear selected tower
          this.clearTowerSelection();
        } else if (gameStore.getState().isBuildMenuOpen) {
          // close build menu
          gameStore.getState().updateIsBuildMenuOpen(false);
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
        gameStore.getState().updateIsGameMenuOpen(true);
      }
    }

    // game hotkeys
    if (gameStore.getState().isGameStarted) {
      // spell
      if (e.key === "q") {
        this.castSpell("fireball");
      }
      if (e.key === "w") {
        this.castSpell("tornado");
      }
      if (e.key === "e") {
        this.castSpell("water");
      }
      if (e.key === "r") {
        this.castSpell("rock");
      }
      // clean
      if (e.key === "c") {
        this.cleanTile();
      }
      // build
      if (e.key === "1") {
        this.buildTower("one", 0);
      }
      if (e.key === "2") {
        this.buildTower("two", 0);
      }
      if (e.key === "3") {
        this.buildTower("three", 0);
      }
      if (e.key === "4") {
        this.buildTower("four", 0);
      }
      if (e.key === "5") {
        this.buildTower("five", 0);
      }
      if (e.key === "6") {
        this.buildTower("six", 0);
      }
      if (e.key === "7") {
        this.buildTower("seven", 0);
      }
      if (e.key === "8") {
        this.buildTower("eight", 0);
      }
      // game menu
      if (e.key === "b") {
        gameStore
          .getState()
          .updateIsBuildMenuOpen(!gameStore.getState().isBuildMenuOpen);
      }
      // cheats
      if (e.key === "g") {
        this.cheatString = "g";
      } else if (this.cheatString === "g" && e.key === "o") {
        this.cheatString += "o";
      } else if (this.cheatString === "go" && e.key === "d") {
        this.cheatString += "d";
        // cheat mode is enabled
        this.lives = 999;
        this.money = 999999;
        this.mana = 999999;
        // update UI
        gameStore.getState().updateLives(this.lives);
        gameStore.getState().updateMoney(this.money);
        gameStore.getState().updateMana(this.mana);
        if (gameStore.getState().isBuildMenuOpen) {
          gameStore.getState().updateIsBuildMenuOpen(false);
        }
        if (gameStore.getState().isSideMenuOpen) {
          gameStore.getState().updateIsSideMenuOpen(false);
        }
        // set cheats flag
        this.isCheatMode = true;
        // show cheats message
        gameStore.getState().updateUIMessage("Cheats enabled!");
        // hide cheat UI message
        setTimeout(() => {
          gameStore.getState().updateUIMessage("");
        }, 3000);
      } else {
        this.cheatString = "";
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

  public isEnoughMoney(
    price: ITDEngine["money"],
    money: ITDEngine["money"] = this.money,
  ) {
    return money >= price;
  }

  public draftShowTower() {
    if (!this.isCanBuild) return;
    this.map!.mapParams.closestTile = this.findClosestBuildTile(
      this.cursorPosition,
    );
    this.draftTower!.currentPosition = this.draftBuildCoordinates;
    this.draftTower!.towerParams.strokeStyle = ColorDict.towerRangeColor;
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
          // this.map?.drawEmptyBackgroundTile(this.draftBuildCoordinates);

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
    this.clearContext(this.context!.constructing!);
    this.clearContext(this.context!.projectile!);
    this.clearContext(this.context!.build!);
    this.clearContext(this.context?.spell!);
    this.clearContext(this.context?.spellDraft!);
    if (this.enemies?.length) {
      this.clearContext(this.context!.enemy!);
      this.clearContext(this.context!.hpBar!);
    }
    if (this.towers?.length) {
      this.clearContext(this.context!.cannon!);
    }
  }

  public gameLoop = () => {
    const timeout = setTimeout(() => {
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

          // clean tile mode
          if (this.isCanClean) {
            this.cleanTile();
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
            // clear deadEnemiesCanvas
            this.clearContext(this.context?.deadEnemy!);
            if (this.enemies?.length === 0) {
              this.clearContext(this.context?.enemy!);
              this.clearContext(this.context?.hpBar!);
            }
            // draw
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
            // clear
            this.clearContext(this.context!.spell!);
            // draw
            this.spells?.forEach((spell: Spell) => {
              spell.draw();
            });
          }

          // gameLoopLogic
          // enemy init || move
          if (!this.waveGenerator?.isInitialized) {
            if (!this.waveGenerator?.waveTimerBetweenWaves) {
              // UI countdown between waves
              gameStore
                .getState()
                .updateCountdown(
                  Math.floor(
                    this.waveGenerator!.waveTimeoutBetweenWaves / 1000,
                  ),
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
              this.waveGenerator.setWaveType();
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
          if (this.enemies?.length && this.towers?.length) {
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
                if (!tower.isCanFire) return;
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
          if (
            !this.isGameOver &&
            this.mana < this.initialGameParams.mana &&
            this.mana >= 0
          ) {
            if (!this.manaIncrementTimer) {
              this.manaIncrementTimer = setInterval(() => {
                this.mana =
                  this.mana + this.manaIncrementQuantity <
                  this.initialGameParams.mana
                    ? this.mana + this.manaIncrementQuantity
                    : this.initialGameParams.mana;
                // UI
                gameStore.getState().updateMana(this.mana);
              }, this.manaIncrementTimeout);
            }
          } else {
            clearInterval(this.manaIncrementTimer!);
            this.manaIncrementTimer = null;
          }
        } else {
          // game is over!
          gameStore.getState().updateIsGameStarted(false);
          gameStore.getState().updateIsGameOver(true);
          this.isGameOver = true;
          // disable score save in cheat_mode
          if (!this.isCheatMode) {
            this.saveScore();
          }
        }

        // request animation frame
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
      } else {
        // cancel browser idle callback fn
        cancelAnimationFrame(this.animationFrameId);
      }
      // clear timeout
      clearTimeout(timeout);
    }, 1000 / this.initialGameParams.fps);
  };

  public saveScore = () => {
    // updateLeaderboard
    try {
      const requestBody: ILeaderboardPostBody = {
        data: {
          score: this.score,
          name: useUserStore.getState().user.login,
        },
        limit: 0,
      };
      useLeaderboardStore.getState().postLeaderboard(requestBody);
    } catch (e) {
      console.error(`Woopsie! Something is broken! ${e.reason || e}`);
    }
  };
}
