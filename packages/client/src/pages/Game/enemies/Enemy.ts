import TDEngine, { ITwoDCoordinates } from "../engine/TDEngine";

export interface IEnemy {
  engine: TDEngine;
  image: CanvasImageSource;
  enemyParams: {
    width: number;
    height: number;
    spaceBetweenEnemies: number;
    speed: number;
    bounty: number;
    rectCenterX?: number;
    rectCenterY?: number;
    strokeStyle?: string;
    hp: number;
    maxHp?: number;
  };
  isHaveAttacker?: boolean;
}

class Enemy {
  constructor(
    public engine: IEnemy["engine"],
    public image?: IEnemy["image"],
    public enemyParams: IEnemy["enemyParams"] = {
      width: 20,
      height: 20,
      spaceBetweenEnemies: 35,
      speed: 0.65,
      bounty: 5,
      strokeStyle: "red",
      rectCenterX: 0,
      rectCenterY: 0,
      hp: 100,
      maxHp: 0,
    },
    public currentPosition: ITwoDCoordinates = {
      x: 0,
      y: 0,
    },
    public randomOffset = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 15) + 1,
    },
    public isHaveAttacker: IEnemy["isHaveAttacker"] = false,
  ) {
    this.enemyParams.rectCenterX = this.enemyParams.width / 2;
    this.enemyParams.rectCenterY = this.enemyParams.height / 2;
    this.enemyParams.maxHp = this.enemyParams.hp;
  }

  public draw() {
    // hp bar
    const hpLeft = this.enemyParams.hp / this.enemyParams.maxHp!;
    this.engine.enemyContext?.beginPath();
    if (hpLeft > 0.65) {
      this.engine.enemyContext!.fillStyle = "green";
    } else if (hpLeft > 0.35) {
      this.engine.enemyContext!.fillStyle = "orange";
    } else {
      this.engine.enemyContext!.fillStyle = "red";
    }
    this.engine.enemyContext?.fillRect(
      this.currentPosition.x,
      this.currentPosition.y - 10,
      this.enemyParams.width * (this.enemyParams.hp / this.enemyParams.maxHp!),
      4,
    );
    this.engine.enemyContext?.closePath();
    /*
        this.engine.enemyContext.setLineDash([])
        this.engine.enemyContext.font = ''
        this.engine.enemyContext.strokeStyle = 'red'
        this.engine.enemyContext.strokeText(`${this.enemyParams.hp}`, this.currentPosition.x, this.currentPosition.y - 5);
         */
    // enemy 2d representation
    if (this.image) {
      this.engine.enemyContext!.beginPath();
      this.engine.enemyContext?.drawImage(
        this.image,
        this.currentPosition.x,
        this.currentPosition.y,
        this.enemyParams.width,
        this.enemyParams.height,
      );
      this.engine.enemyContext!.closePath();
    } else {
      this.engine.enemyContext!.beginPath();
      this.engine.enemyContext!.strokeStyle = this.enemyParams.strokeStyle!;
      this.engine.enemyContext!.rect(
        this.currentPosition.x,
        this.currentPosition.y,
        this.enemyParams.width,
        this.enemyParams.height,
      );
      this.engine.enemyContext!.stroke();
      this.engine.enemyContext!.closePath();
    }
  }

  public drawEnemy(initialPosition: ITwoDCoordinates = { x: 0, y: 0 }) {
    // set initial coords of enemy
    this.currentPosition.x =
      this.engine.map?.mapParams.startX! +
      this.randomOffset.x +
      initialPosition.x;
    this.currentPosition.y =
      this.engine.map?.mapParams.startY! +
      this.randomOffset.y +
      initialPosition.y;
    // draw enemy
    this.draw();
  }

  public moveRight() {
    // increment x, y is constant
    this.currentPosition.x += this.enemyParams.speed;
    // draw enemy
    this.draw();
  }

  public moveDown() {
    // increment y, x is constant
    this.currentPosition.y += this.enemyParams.speed;
    // draw enemy
    this.draw();
  }

  // enemy movement logic
  public move() {
    // moving right and then
    if (
      this.currentPosition.x <=
      this.engine.map?.mapParams.rightBorder! + this.randomOffset.x
    ) {
      this.moveRight();
    } else {
      // move down and then
      if (
        this.currentPosition.y <=
        this.engine.map?.mapParams.bottomBorder! +
          this.engine.map!.mapParams.gridStep +
          this.randomOffset.x
      ) {
        this.moveDown();
      } else {
        // move right and then stop
        if (
          this.currentPosition.x <=
          this.engine.map?.mapParams.width! + this.randomOffset.x
        ) {
          this.moveRight();
        } else {
          // delete enemies that are out of map borders
          this.destroy();
          // decrement life quantity
          this.engine.lives -= 1;
        }
      }
    }
  }

  public destroy() {
    // pop en enemy
    this.engine.enemies = this.engine.enemies?.filter(
      (enemy: Enemy) => this !== enemy,
    );

    // release tower target
    for (const tower of this.engine.towers!) {
      if (tower.target === this) {
        tower.target = null;
      }
    }

    this.engine.score += 1;
    this.engine.money += this.enemyParams.bounty;
  }
}

export default Enemy;
