import TDEngine, {
  ITwoDCoordinates,
  TTowerSpriteTypes,
} from "../engine/TDEngine";
import Enemy from "../enemies/Enemy";
import Projectile from "../projectiles/Projectile";

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

export interface ITower {
  engine: TDEngine;
  type: TTowerSpriteTypes;
  upgradeLevel: 0 | 1 | 2;
  towerParams: {
    attackRate: number;
    attackDamage: number;
    attackRange: number;
    baseWidth: number;
    baseHeight: number;
    dimensions: Record<TTowerParamsDimensions, number>[];
    cannonFrameLimit: number;
    isSelected: boolean;
    rectCenterX: number;
    rectCenterY: number;
    strokeStyle: string;
    firingAngle: number;
    prevFiringAngle?: number;
    fireFromCoords: ITwoDCoordinates;
    price?: number;
  };
  projectileParams: {
    acceleration: number;
    projectileSpeed: number;
    targetX: number;
    targetY: number;
    rectCenterX: number;
    rectCenterY: number;
    dimensions: Record<TProjectileParamsDimensions, number>[];
    projectileFrameLimit: number;
    impactFrameLimit: number;
  };
  image: CanvasImageSource;
  attackIntervalTimer: NodeJS.Timer | null;
}

class Tower {
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
      strokeStyle: "rgba(0, 255, 0, 0.2)",
      firingAngle: 0,
      prevFiringAngle: 0,
      fireFromCoords: { x: 0, y: 0 },
      price: 15,
    },
    public projectileParams: ITower["projectileParams"] = {
      acceleration: 1.2,
      projectileSpeed: 0.1,
      targetX: 0,
      targetY: 0,
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
    public renderParams = {
      cannonWeaponArr: "levelOneWeapon",
      cannonProjectileArr: "levelOneProjectile",
      cannonOffset: { x: 0, y: 0 },
      cannonFrameLimit: 6,
      cannonCurrentFrame: 0,
      isCannonAnimate: false,
    },
    public attackIntervalTimer: ITower["attackIntervalTimer"] = null,
  ) {
    this.towerParams.rectCenterX = this.towerParams.baseWidth / 2;
    this.towerParams.rectCenterY = this.towerParams.baseWidth / 2;
    this.renderParams.cannonOffset.x =
      this.engine.predefinedTowerParams[this.type]?.towerParams?.dimensions[
        this.upgradeLevel
      ].cannonOffsetX!;
    this.renderParams.cannonOffset.y =
      this.engine.predefinedTowerParams[this.type]?.towerParams?.dimensions[
        this.upgradeLevel
      ].cannonOffsetY!;
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
    if (this.towerParams.isSelected) {
      context.strokeStyle = "red";
      context.lineWidth = 1;
      context.strokeRect(
        this.currentPosition.x - this.engine.map?.mapParams?.gridStep!,
        this.currentPosition.y - this.engine.map?.mapParams?.gridStep!,
        this.engine.map?.mapParams?.gridStep!,
        this.engine.map?.mapParams?.gridStep!,
      );
    }
    context.closePath();
  }

  public drawCannon(context: CanvasRenderingContext2D) {
    // tower cannon
    context.save();
    context.beginPath();
    context.translate(
      this.currentPosition.x -
        this.towerParams.baseWidth +
        this.towerParams.baseWidth / 2,
      this.currentPosition.y -
        this.towerParams.baseHeight +
        this.towerParams.baseWidth / 2 +
        this.towerParams.dimensions[this.upgradeLevel].cannonOffsetY,
    );
    context.rotate(this.towerParams.firingAngle - 1.2);
    context.translate(
      -(this.towerParams.dimensions[this.upgradeLevel].cannonWidth / 2),
      -(this.towerParams.dimensions[this.upgradeLevel].cannonHeight / 2),
    );
    context.drawImage(
      (
        this.engine.towerSprites[this.type]!.canvasArr?.weapon![
          this.upgradeLevel
        ]! as HTMLCanvasElement[]
      )[this.getNextCannonFrame()]!,
      0,
      0,
    );
    context.closePath();
    context.restore();
    // set new firing angle
    this.towerParams.prevFiringAngle = this.towerParams.firingAngle;
    // set new firing point
    this.towerParams.fireFromCoords = {
      x:
        this.currentPosition.x -
        this.towerParams.baseWidth +
        this.towerParams.baseWidth / 2 +
        (this.towerParams.dimensions[this.upgradeLevel].cannonWidth / 4) *
          Math.cos(this.towerParams.firingAngle - Math.PI),
      y:
        this.currentPosition.y -
        this.towerParams.baseHeight +
        this.towerParams.baseWidth / 2 +
        (this.towerParams.dimensions[this.upgradeLevel].cannonHeight / 4) *
          Math.sin(this.towerParams.firingAngle - Math.PI),
    };
    /*
    // debug
    context.fillStyle = "red";
    context.fillRect(
      this.towerParams.fireFromCoords.x,
      this.towerParams.fireFromCoords.y,
      2,
      2,
    );
    this.towerParams.fireFromCoords = {
      x:
        this.currentPosition.x -
        this.towerParams.baseWidth +
        this.towerParams.baseWidth / 2,
      y:
        this.currentPosition.y -
        this.towerParams.baseHeight +
        this.towerParams.baseWidth / 2 +
        this.towerParams.dimensions[this.upgradeLevel].cannonOffsetY,
    };

    this.towerParams.fireFromCoords = {
      x:
        this.currentPosition.x -
        this.towerParams.baseWidth +
        this.towerParams.baseWidth / 2,
      y:
        this.currentPosition.y -
        this.towerParams.baseHeight +
        this.towerParams.baseWidth / 2 +
        this.towerParams.dimensions[this.upgradeLevel].cannonOffsetY,
    };
     */
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
    // tower base
    this.drawBase(this.engine.context!.tower!);
    // tower cannon
    this.drawCannon(this.engine.context!.cannon!);
  }

  public setAttackInterval = () => {
    if (this.attackIntervalTimer) return;
    // clear memory
    this.clearAttackInterval();
    // initial fire
    this.isCanFire = true;
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
    context.fillStyle = this.towerParams.strokeStyle;
    // draw tower range
    context.arc(
      this.currentPosition.x - this.towerParams.baseWidth / 2,
      this.currentPosition.y - this.towerParams.baseHeight / 2,
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
      this.towerParams.baseHeight / 2 -
      (enemy.currentPosition.y + enemy.enemyParams.height! / 2);
    if (Math.hypot(xDistance, yDistance) < this.towerParams.attackRange) {
      this.target = enemy;
      if (!this.attackIntervalTimer) {
        this.setAttackInterval();
      }
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
          ) < this.towerParams.attackRange &&
          Math.abs(
            this.currentPosition.y -
              this.towerParams.baseHeight / 2 -
              enemy.currentPosition.y +
              enemy.enemyParams.height! / 2,
          ) < this.towerParams.attackRange
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

    this.towerParams.firingAngle =
      Math.atan2(yDistance, xDistance) + Math.PI - Math.PI / 4;
  }

  public fire() {
    if (this.isCanFire && this.target) {
      this.renderParams.cannonCurrentFrame = 0;
      this.renderParams.isCannonAnimate = true;
      this.engine.pushProjectile(
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
    this.engine.towers = this.engine.towers!.filter((tower) => this !== tower);
  }
}

export default Tower;
