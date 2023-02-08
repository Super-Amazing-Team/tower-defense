import TDEngine, { ITwoDCoordinates } from "../engine/TDEngine";
import Enemy from "../enemies/Enemy";
import Tower, { ITower } from "../towers/Tower";

export interface IProjectile {
  image: CanvasImageSource;
}

class Projectile {
  constructor(
    public image: IProjectile["image"],
    public target: Enemy | null,
    public tower: Tower,
    public damage: ITower["towerParams"]["attackDamage"],
    public currentPosition: ITwoDCoordinates = {
      x: 0,
      y: 0,
    },
    public distanceMoved = 0,
    public projectileHitTimer: NodeJS.Timer | null = null,
  ) {
    this.tower.projectileParams.rectCenterX =
      this.tower.projectileParams.width / 2;
    this.tower.projectileParams.rectCenterY =
      this.tower.projectileParams.height / 2;
  }

  public draw() {
    this.tower.engine.context?.beginPath();
    if (this.image) {
      this.tower.engine.context?.drawImage(
        this.image,
        Math.floor(this.currentPosition.x),
        Math.floor(this.currentPosition.y),
        this.tower.projectileParams.width,
        this.tower.projectileParams.height,
      );
    } else {
      this.tower.engine.context!.strokeStyle = "black";
      this.tower.engine.context?.strokeRect(
        this.currentPosition.x,
        this.currentPosition.y,
        this.tower.projectileParams.width,
        this.tower.projectileParams.height,
      );
      this.tower.engine.context?.stroke();
    }
    this.tower.engine.context?.closePath();
  }

  public move() {
    if (!this.target) {
      this.destroy();
    } else if (
      // if projectile out of map borders, then destroy this projectile
      this.currentPosition.x > this.tower.engine.map?.mapParams.width! ||
      this.currentPosition.y > this.tower.engine.map?.mapParams.height!
    ) {
      this.destroy();
    }
    // increment projectile moved distance by speed
    this.distanceMoved += this.tower.projectileParams.projectileSpeed;
    // vector projectile to the target and increment projectile 2d coords
    this.findTargetVector();

    // draw projectile 2d representation
    this.draw();
  }

  public findTargetVector() {
    if (!this.target) {
      return;
    }
    // find unit vector
    const xDistance =
      this.target.currentPosition.x +
      this.tower.projectileParams.rectCenterX -
      this.currentPosition.x;
    const yDistance =
      this.target.currentPosition.y +
      this.tower.projectileParams.rectCenterY -
      this.currentPosition.y;
    const distanceToTarget = Math.hypot(xDistance, yDistance);

    if (distanceToTarget < this.distanceMoved) {
      // collision
      this.collision();
    } else {
      this.currentPosition.x = Math.floor(
        this.currentPosition.x +
          (this.distanceMoved * xDistance) / distanceToTarget,
      );
      this.currentPosition.y = Math.floor(
        this.currentPosition.y +
          (this.distanceMoved * yDistance) / distanceToTarget,
      );
    }
  }

  public collision() {
    this.image = this.tower.projectileHitImage!;
    this.draw();
    // set remove projectileHitImage
    if (!this.projectileHitTimer) {
      this.projectileHitTimer = setTimeout(() => {
        clearTimeout(this.projectileHitTimer!);
        this.destroy();
      }, this.tower.projectileParams.projectileHitAlive);
    }
    if (
      this.target!.enemyParams.hp > 0 &&
      this.tower.engine.enemies!.indexOf(this.target!) > -1
    ) {
      this.target!.enemyParams.hp -= this.damage;
      this.damage = 0;
    } else if (
      this.target!.enemyParams.hp <= 0 &&
      this.tower.engine.enemies!.indexOf(this.target!) > -1
    ) {
      // target is dead
      // destroy projectile
      this.tower.engine.projectiles!.filter(
        (projectile) => this.target === projectile.target,
      );
      // release tower target
      this.tower.target = null;
      // destroy projectile target
      this.target?.destroy();
    } else if (this.target!.enemyParams.hp <= 0) {
      this.tower.target = null;
    }
  }

  public destroy() {
    this.tower.engine.projectiles = this.tower.engine.projectiles!.filter(
      (projectile) => this !== projectile,
    );
  }
}

export default Projectile;
