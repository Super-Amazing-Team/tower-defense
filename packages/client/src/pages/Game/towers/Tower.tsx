import {
  TDEngine,
  ITwoDCoordinates,
  TTowerTypes,
  ColorDict,
} from "../engine/TDEngine";
import { Enemy } from "../enemies/Enemy";
import { Projectile } from "../projectiles/Projectile";
import { useGameStore } from "@/store";

export type TTowerParamsDimensions =
  | "cannonWidth"
  | "cannonHeight"
  | "cannonOffsetX"
  | "cannonOffsetY";

export type TProjectileParamsDimensions =
  | "projectileWidth"
  | "projectileHeight"
  | "impactWidth"
  | "impactHeight";

export type TProjectileAttackModifiers = "slow" | "freeze" | "splash" | "shock";

export interface ITower {
  engine: TDEngine;
  type: TTowerTypes;
  upgradeLevel: 0 | 1 | 2;
  towerParams: {
    attackRate: number;
    attackDamage: number;
    attackRange: number;
    baseWidth: number;
    baseHeight: number;
    constructionWidth: number;
    constructionHeight: number;
    constructionFrameLimit: number;
    constructionSellFrameLimit: number;
    dimensions: Record<TTowerParamsDimensions, number>[];
    cannonFrameLimit: number;
    isSelected?: boolean;
    rectCenterX?: number;
    rectCenterY?: number;
    strokeStyle: string;
    firingAngle?: number;
    prevFiringAngle?: number;
    fireFromCoords?: ITwoDCoordinates;
    price?: number;
    maxUpgradeLevel?: number;
  };
  projectileParams: {
    acceleration: number;
    projectileSpeed: number;
    rectCenterX?: number;
    rectCenterY?: number;
    dimensions: Record<TProjectileParamsDimensions, number>[];
    projectileFrameLimit: number;
    impactFrameLimit: number;
    attackModifier?: TProjectileAttackModifiers;
    attackModifierTimeout?: number;
    attackModifierRange?: number;
  };
  image: CanvasImageSource;
  attackIntervalTimer: NodeJS.Timer | null;
  renderParams: {
    cannonOffset: ITwoDCoordinates;
    cannonFrameLimit: number;
    cannonCurrentFrame: number;
    isCannonAnimate: boolean;
    isConstructing: boolean;
    isConstructionEnd: boolean;
    isSelling: boolean;
    constructingCurrentFrame: number;
    constructionProgressTime: number;
    constructionProgressPercent: number;
    constructionProgressTimer: NodeJS.Timer | null;
    constructionTimeout: number;
    constructionTimer: NodeJS.Timer | null;
  };
}

export class Tower {
  public target?: Enemy | null;

  public isCanFire? = false;

  constructor(
    public engine: ITower["engine"],
    public type: ITower["type"],
    public upgradeLevel: ITower["upgradeLevel"] = 0,
    public currentPosition: ITwoDCoordinates = {
      x: 0,
      y: 0,
    },
    public towerParams: ITower["towerParams"] = {
      attackRate: 1000,
      attackDamage: 30,
      attackRange: 120,
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
          cannonOffsetY: 0,
        },
        {
          cannonWidth: 64,
          cannonHeight: 64,
          cannonOffsetX: 0,
          cannonOffsetY: 0,
        },
        {
          cannonWidth: 64,
          cannonHeight: 64,
          cannonOffsetX: 0,
          cannonOffsetY: 0,
        },
      ],
      cannonFrameLimit: 3,
      isSelected: false,
      rectCenterX: 0,
      rectCenterY: 0,
      strokeStyle: "green",
      prevFiringAngle: 0,
      fireFromCoords: { x: 0, y: 0 },
      maxUpgradeLevel: 2,
      price: 15,
    },
    public projectileParams: ITower["projectileParams"] = {
      acceleration: 1.2,
      projectileSpeed: 0.1,
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
      attackModifier: undefined,
      attackModifierTimeout: 3000,
    },
    public renderParams: ITower["renderParams"] = {
      cannonOffset: { x: 0, y: 0 },
      cannonFrameLimit: 6,
      cannonCurrentFrame: 0,
      isCannonAnimate: false,
      isConstructing: false,
      isConstructionEnd: false,
      isSelling: false,
      constructingCurrentFrame: 0,
      constructionProgressTime: 0,
      constructionProgressPercent: 0,
      constructionProgressTimer: null,
      constructionTimeout: 5000,
      constructionTimer: null,
    },
    public attackIntervalTimer: ITower["attackIntervalTimer"] = null,
  ) {
    // set center params
    this.towerParams.rectCenterX = this.towerParams.baseWidth / 2;
    this.towerParams.rectCenterY = this.towerParams.baseWidth / 2;
    // set cannon offsets
    this.renderParams.cannonOffset.x =
      this.engine.predefinedTowerParams[this.type]?.towerParams?.dimensions[
        this.upgradeLevel
      ].cannonOffsetX!;
    this.renderParams.cannonOffset.y =
      this.engine.predefinedTowerParams[this.type]?.towerParams?.dimensions[
        this.upgradeLevel
      ].cannonOffsetY!;
    // set upgrade timeout
    this.renderParams.constructionTimeout = this.upgradeLevel
      ? this.renderParams.constructionTimeout * this.upgradeLevel
      : this.renderParams.constructionTimeout;
    // set firing coords
    if (!this.towerParams.fireFromCoords) {
      this.towerParams.fireFromCoords = { x: 0, y: 0 };
    }
  }

  public getNextConstructionFrame(
    limit = this.towerParams.constructionFrameLimit - 1,
  ) {
    if (this.renderParams.isConstructing) {
      if (this.renderParams.isConstructionEnd) {
        if (this.renderParams.constructingCurrentFrame < limit) {
          this.renderParams.constructingCurrentFrame += 1;
        } else {
          this.renderParams.constructingCurrentFrame = 0;
          this.renderParams.isConstructing = false;
          this.renderParams.isConstructionEnd = false;
          // set attack interval
          this.setAttackInterval();
          // initial fire
          this.isCanFire = true;
          // clear build canvas
          this.engine.clearContext(this.engine.context?.build!);
          // clear tower canvas
          this.engine.clearContext(this.engine.context?.tower!);
          this.engine.towers?.forEach((tower) => {
            tower.draw();
          });
        }
      } else {
        if (this.renderParams.constructingCurrentFrame < limit) {
          this.renderParams.constructingCurrentFrame += 1;
        } else {
          this.renderParams.constructingCurrentFrame = 0;
        }
      }
    } else if (this.renderParams.isSelling) {
      if (this.renderParams.constructingCurrentFrame < limit) {
        this.renderParams.constructingCurrentFrame += 1;
      } else {
        this.destroy();
        // clear tower canvas
        this.engine.clearContext(this.engine.context?.tower!);
        // and redraw only existing towers
        this.engine.towers?.forEach((tower) => {
          tower.draw();
          // remove tower selection
          if (tower.towerParams.isSelected) {
            tower.towerParams.isSelected = false;
          }
        });
        // pop tile from towerTilesArr
        this.renderParams.isSelling = false;
      }
    }
    return this.renderParams.constructingCurrentFrame;
  }

  public getNextCannonFrame() {
    if (this.renderParams.isCannonAnimate) {
      if (
        this.renderParams.cannonCurrentFrame <
        this.renderParams.cannonFrameLimit - 1
      ) {
        this.renderParams.cannonCurrentFrame += 1;
      } else {
        this.renderParams.isCannonAnimate = false;
        return 0;
      }
    } else {
      return 0;
    }
    return this.renderParams.cannonCurrentFrame;
  }

  public drawConstructionProgress(
    context: CanvasRenderingContext2D = this.engine.context!.constructing!,
  ) {
    context.fillStyle = "white";
    context.font = "14px sans-serif";
    context.textAlign = "center";
    context.fillText(
      `${this.renderParams.constructionProgressPercent}%`,
      this.currentPosition.x - this.towerParams.baseWidth / 2,
      this.currentPosition.y - 10,
      this.towerParams.baseWidth,
    );
  }

  public drawSelling(
    context: CanvasRenderingContext2D = this.engine.context!.constructing!,
  ) {
    if (this.renderParams.isSelling) {
      if (this.renderParams.constructingCurrentFrame === 0) {
        // redraw map road
        this.engine.map?.drawMap();
        // clear tower canvas and redraw only towers dat is not selling
        this.engine.clearContext(this.engine.context?.tower!);
        this.engine.towers?.forEach((tower) => {
          if (tower !== this) {
            tower.draw();
          }
        });
      }
      context.beginPath();
      context.drawImage(
        (
          this.engine.towerSprites[this.type]!.canvasArr
            ?.constructionSell as HTMLCanvasElement[]
        )[
          this.getNextConstructionFrame(
            this.towerParams.constructionSellFrameLimit - 1,
          )
        ],
        this.currentPosition.x -
          (this.towerParams.constructionHeight - this.towerParams.baseWidth) +
          this.engine.map?.mapParams?.gridStep! / 2,
        this.currentPosition.y -
          (this.towerParams.constructionWidth - this.towerParams.baseHeight) -
          this.engine.map?.mapParams?.gridStep!,
        this.towerParams.constructionHeight,
        this.towerParams.constructionWidth,
      );
      context.closePath();
    }
  }

  public drawConstructing(
    context: CanvasRenderingContext2D = this.engine.context!.constructing!,
  ) {
    if (this.renderParams.isConstructing) {
      if (
        !this.renderParams!.constructionTimer &&
        !this.renderParams.isConstructionEnd
      ) {
        // increment construction progress time
        if (!this.renderParams.constructionProgressTimer) {
          this.renderParams!.constructionProgressTimer = setInterval(() => {
            this.renderParams.constructionProgressTime += 250;
            this.renderParams.constructionProgressPercent = Math.floor(
              (this.renderParams.constructionProgressTime /
                this.renderParams?.constructionTimeout) *
                100,
            );
            // UI construction time update
            if (
              useGameStore.getState().selectedTower === this &&
              (this.renderParams.constructionProgressPercent < 10 ||
                this.renderParams.constructionProgressPercent % 10 === 0)
            ) {
              useGameStore
                .getState()
                .updateConstructionProgress(
                  this.renderParams.constructionProgressPercent,
                );
            }
          }, 250);
        }
        this.renderParams!.constructionTimer = setTimeout(() => {
          // clear timeout timer
          clearTimeout(this.renderParams!.constructionTimer!);
          this.renderParams!.constructionTimer = null;
          // clear construction progress timer && time
          clearInterval(this.renderParams.constructionProgressTimer!);
          this.renderParams.constructionProgressTimer = null;
          this.renderParams.constructionProgressTime = 0;
          this.renderParams.constructionProgressPercent = 0;
          // set construction animation to beginning
          this.renderParams.constructingCurrentFrame = 0;
          this.renderParams.isConstructionEnd = true;
          // UI construction time update
          if (useGameStore.getState().selectedTower === this) {
            useGameStore.getState().updateConstructionProgress(0);
          }
        }, this.renderParams?.constructionTimeout);
      }
      // tower base
      context.beginPath();
      if (this.renderParams.isConstructionEnd) {
        context.drawImage(
          (
            this.engine.towerSprites[this.type]!.canvasArr?.constructionEnd[
              this.upgradeLevel
            ]! as HTMLCanvasElement[]
          )[this.getNextConstructionFrame()],
          this.currentPosition.x -
            (this.towerParams.constructionWidth - this.towerParams.baseWidth),
          this.currentPosition.y -
            (this.towerParams.constructionHeight -
              this.towerParams.baseHeight / 2),
          this.towerParams.constructionWidth,
          this.towerParams.constructionHeight,
        );
      } else {
        context.drawImage(
          (
            this.engine.towerSprites[this.type]!.canvasArr?.construction[
              this.upgradeLevel
            ]! as HTMLCanvasElement[]
          )[this.getNextConstructionFrame()],
          this.currentPosition.x -
            (this.towerParams.constructionWidth - this.towerParams.baseWidth),
          this.currentPosition.y -
            (this.towerParams.constructionHeight -
              this.towerParams.baseHeight / 2),
          this.towerParams.constructionWidth,
          this.towerParams.constructionHeight,
        );
        // draw progress
        this.drawConstructionProgress();
      }
      context.closePath();
    }
  }

  public drawBase(
    context: CanvasRenderingContext2D = this.engine.context!.tower!,
  ) {
    // tower base
    context.beginPath();
    context.drawImage(
      this.engine.towerSprites[this.type]!.canvasArr?.base![
        this.upgradeLevel
      ]! as HTMLCanvasElement,
      this.currentPosition.x - this.towerParams.baseWidth,
      this.currentPosition.y - this.towerParams.baseHeight,
      this.towerParams.baseWidth,
      this.towerParams.baseHeight,
    );
    // is tower selected?
    if (this.engine.selectedTower === this && this.towerParams.isSelected) {
      this.drawSelection();
    }
    context.closePath();
  }

  public drawSelection(
    context: CanvasRenderingContext2D = this.engine.context!.selection!,
  ) {
    context.beginPath();
    context.strokeStyle = ColorDict.tileSelectionColor;
    // context.setLineDash([15, 5]);
    context.lineWidth = 2;
    context.strokeRect(
      this.currentPosition.x - this.engine.map?.mapParams?.gridStep! - 1,
      this.currentPosition.y - this.engine.map?.mapParams?.gridStep! - 1,
      this.engine.map?.mapParams?.gridStep! + 2,
      this.engine.map?.mapParams?.gridStep! + 2,
    );
    context.closePath();
  }

  public drawCannon(context: CanvasRenderingContext2D) {
    const isShouldRotate =
      this.towerParams.prevFiringAngle === this.towerParams.firingAngle;
    // find rectangle diagonal
    const canvasHypot = Math.ceil(
      Math.hypot(
        this.engine.predefinedTowerParams[this.type]?.towerParams?.dimensions[
          this.upgradeLevel
        ].cannonWidth!,
        this.engine.predefinedTowerParams[this.type]?.towerParams?.dimensions[
          this.upgradeLevel
        ].cannonHeight!,
      ),
    );
    if (isShouldRotate && this.target) {
      const canvas = (
        this.engine.towerSprites[this.type]!.canvasArr?.weapon![
          this.upgradeLevel
        ] as HTMLCanvasElement[]
      )[this.getNextCannonFrame()]!;
      // get current frame to rotate projectile image and draw it in main projectile context
      const rotationContext = (
        this.engine.towerSprites[this.type]!.canvasContextArr?.weapon[
          this.upgradeLevel
        ]! as CanvasRenderingContext2D[]
      )[this.towerParams.cannonFrameLimit]!;

      // rotate frame
      rotationContext.save();
      rotationContext.clearRect(0, 0, canvasHypot, canvasHypot);
      rotationContext.beginPath();
      rotationContext.translate(canvasHypot / 2, canvasHypot / 2);
      rotationContext.rotate(this.towerParams.firingAngle! - 1);
      rotationContext.drawImage(canvas, -canvasHypot / 2, -canvasHypot / 2);
      rotationContext.closePath();
      rotationContext.restore();
    }

    // tower cannon
    context.drawImage(
      (
        this.engine.towerSprites[this.type]!.canvasArr?.weapon![
          this.upgradeLevel
        ] as HTMLCanvasElement[]
      )[isShouldRotate ? this.towerParams.cannonFrameLimit : 0]!,
      this.currentPosition.x -
        canvasHypot +
        (canvasHypot - this.towerParams.baseWidth) / 2,
      this.currentPosition.y -
        this.towerParams.baseHeight +
        (this.towerParams.baseWidth - canvasHypot) / 2 +
        this.towerParams.dimensions[this.upgradeLevel].cannonOffsetY,
    );
    // set new firing point
    this.towerParams.fireFromCoords = {
      x:
        this.currentPosition.x -
        this.towerParams.baseWidth +
        this.towerParams.baseWidth / 2 +
        (this.towerParams.dimensions[this.upgradeLevel].cannonWidth / 4) *
          Math.cos(this.towerParams.firingAngle! - Math.PI),
      y:
        this.currentPosition.y -
        this.towerParams.baseHeight +
        this.towerParams.baseWidth / 2 +
        (this.towerParams.dimensions[this.upgradeLevel].cannonHeight / 4) *
          Math.sin(this.towerParams.firingAngle! - Math.PI),
    };
  }

  public drawDraft() {
    // draw tower range
    if (this.engine.isCanBuild) {
      this.engine.draftTower?.drawTowerRange();
    }
    // tower base
    this.drawBase(this.engine.context!.build!);
    // tower cannon
    this.drawCannon(this.engine.context!.build!);
  }

  // tower 2d representation
  public draw() {
    if (this.renderParams.isConstructing) {
      this.drawConstructing(this.engine.context!.build!);
    } else if (this.renderParams.isSelling) {
      this.drawSelling(this.engine.context!.build!);
    } else {
      // tower base
      this.drawBase(this.engine.context!.tower!);
      // tower cannon
      this.drawCannon(this.engine.context!.cannon!);
    }
  }

  public setAttackInterval = () => {
    if (this.attackIntervalTimer) return;
    // clear memory
    this.clearAttackInterval();
    // then set attack interval
    this.attackIntervalTimer = setInterval(() => {
      this.isCanFire = true;
    }, this.towerParams.attackRate);
  };

  public clearAttackInterval = () => {
    clearInterval(this.attackIntervalTimer!);
    this.attackIntervalTimer = null;
  };

  public drawTowerRange(
    context: CanvasRenderingContext2D = this.engine.context!.build!,
  ) {
    context.beginPath();
    context.lineWidth = 1;
    // context.setLineDash([10, 15]);
    context.fillStyle = ColorDict.towerRangeColor;
    // draw tower range
    context.arc(
      this.currentPosition.x - this.towerParams.baseWidth / 2,
      this.currentPosition.y - this.towerParams.baseWidth / 2,
      this.towerParams.attackRange,
      0,
      360,
    );
    context.fill();
    context.closePath();
  }

  public isEnemyInRange(enemy: Enemy) {
    const xDistance =
      this.currentPosition.x -
      this.towerParams.baseWidth / 2 -
      (enemy.currentPosition.x + enemy.enemyParams.width! / 2);
    const yDistance =
      this.currentPosition.y -
      this.towerParams.baseWidth / 2 -
      (enemy.currentPosition.y + enemy.enemyParams.height! / 2);
    if (Math.hypot(xDistance, yDistance) < this.towerParams.attackRange) {
      this.target = enemy;
      /*
      if (!this.attackIntervalTimer && !this.renderParams.isConstructing) {
        this.setAttackInterval();
      }
       */
      return true;
    }
    return false;
  }

  public findTarget() {
    if (!this.engine.enemies!.length) return;
    if (!this.target) {
      this.engine.enemies?.forEach((enemy) => {
        // check range only for the closest enemies
        if (
          Math.abs(
            this.currentPosition.x -
              this.towerParams.baseWidth / 2 -
              enemy.currentPosition.x +
              enemy.enemyParams.width! / 2,
          ) <=
            this.towerParams.attackRange * 1.2 &&
          Math.abs(
            this.currentPosition.y -
              this.towerParams.baseWidth / 2 -
              enemy.currentPosition.y +
              enemy.enemyParams.height! / 2,
          ) <=
            this.towerParams.attackRange * 1.2
        ) {
          return this.isEnemyInRange(enemy);
        }
        return false;
      });
    } else {
      if (!this.isEnemyInRange(this.target)) {
        this.target = null;
      }
    }
  }

  public findTargetAngle() {
    // there is no spoon, Neo
    if (!this.target) return;
    const xDistance =
      this.target.currentPosition.x -
      this.currentPosition.x +
      this.target.enemyParams.rectCenterX!;
    const yDistance =
      this.target.currentPosition.y -
      this.currentPosition.y +
      this.target.enemyParams.rectCenterY!;

    // set new firing angle
    this.towerParams.firingAngle =
      Math.atan2(yDistance, xDistance) + Math.PI - Math.PI / 4;

    if (this.towerParams.prevFiringAngle !== this.towerParams.firingAngle) {
      this.towerParams.prevFiringAngle = this.towerParams.firingAngle;
    }
  }

  public fire() {
    if (this.isCanFire && this.attackIntervalTimer) {
      this.renderParams.cannonCurrentFrame = 0;
      this.renderParams.isCannonAnimate = true;
      this.engine.projectiles?.push(
        new Projectile(
          this.target!,
          this,
          this.towerParams.attackDamage,
          this.towerParams.fireFromCoords,
        ),
      );

      this.isCanFire = false;
    }
  }

  public destroy() {
    this.engine.map!.mapParams!.towerTilesArr =
      this.engine.map?.mapParams?.towerTilesArr!.filter(
        (tile: ITwoDCoordinates) =>
          tile.x !== this.currentPosition.x ||
          tile.y !== this.currentPosition.y,
      )!;
    this.engine.towers = this.engine.towers!.filter((tower) => this !== tower);
  }
}
