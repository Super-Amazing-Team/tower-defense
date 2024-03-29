import {
  TDEngine,
  ITwoDCoordinates,
  TEnemyType,
  ColorDict,
} from "../engine/TDEngine";
import { TProjectileAttackModifiers } from "@/pages/Game/towers/Tower";
import { useGameStore } from "@/store";
export interface IEnemy {
  engine: TDEngine;
  sprite?: Record<string, CanvasImageSource[]>[];
  spriteCanvas?: Record<string, HTMLCanvasElement[]>[];
  enemyParams: {
    type?: TEnemyType;
    width?: number;
    height?: number;
    spaceBetweenEnemies?: number;
    speed?: number;
    initialSpeed?: number;
    bounty?: number;
    rectCenterX?: number;
    rectCenterY?: number;
    strokeStyle?: string;
    hp: number;
    isModified?: boolean;
    attackModifier?: TProjectileAttackModifiers;
    modifiedSlowTimer?: NodeJS.Timer | null;
    modifiedShockTimer?: NodeJS.Timer | null;
    modifiedPoisonDuration?: NodeJS.Timer | null;
    modifiedPoisonDPSInterval?: NodeJS.Timer | null;
    maxHp?: number;
  };
  renderParams: {
    currentFrame: number;
    isAnimateDeath: boolean;
    framesPerSprite: number;
  };
  currentStage: number;
}

export class Enemy {
  constructor(
    public engine: IEnemy["engine"],
    public enemyParams: IEnemy["enemyParams"] = {
      type: "firebug",
      width: 64,
      height: 64,
      spaceBetweenEnemies: 35,
      speed: 0.65,
      initialSpeed: 0.65,
      bounty: 5,
      strokeStyle: "red",
      rectCenterX: 0,
      rectCenterY: 0,
      hp: 100,
      maxHp: 0,
      isModified: false,
    },
    public renderParams: IEnemy["renderParams"] = {
      currentFrame: Math.floor(
        Math.random() * engine.enemySprites[enemyParams.type]?.framesPerSprite,
      ),
      isAnimateDeath: false,
      framesPerSprite: 8,
    },
    public currentStage: IEnemy["currentStage"] = 0,
    public currentPosition: ITwoDCoordinates = {
      x: 0,
      y: 0,
    },
    public randomOffset = {
      x: Math.floor(Math.random() * 32),
      y: Math.floor(Math.random() * 12),
    },
  ) {
    // save initial speed
    this.enemyParams.initialSpeed = this.enemyParams.speed;
    this.enemyParams.rectCenterX = this.enemyParams?.width! / 2;
    this.enemyParams.rectCenterY = this.enemyParams?.height! / 2;
    this.enemyParams.maxHp = this.enemyParams.hp;
    // set random animation frame
    this.renderParams.currentFrame = Math.floor(
      Math.random() * this.renderParams.framesPerSprite,
    );
  }

  public drawHpBar(
    context: CanvasRenderingContext2D = this.engine.context!.hpBar!,
  ) {
    const hpLeft = this.enemyParams.hp / this.enemyParams.maxHp!;
    context.beginPath();
    // regular hpbar
    if (!this.enemyParams.isModified) {
      if (hpLeft > 0.95) {
        context.fillStyle = "green";
      } else if (hpLeft > 0.75) {
        context.fillStyle = "darkorange";
      } else if (hpLeft > 0.55) {
        context.fillStyle = "orange";
      } else if (hpLeft > 0.35) {
        context.fillStyle = "orange";
      } else if (hpLeft > 0.15) {
        context.fillStyle = "red";
      } else {
        context.fillStyle = "maroon";
      }
      // target have attack modifier
    } else {
      if (this.enemyParams.attackModifier === "slow") {
        context.fillStyle = ColorDict.specialAttackslowColor;
      } else if (this.enemyParams.attackModifier === "shock") {
        context.fillStyle = ColorDict.specialAttackshockColor;
      } else if (this.enemyParams.attackModifier === "poison") {
        context.fillStyle = ColorDict.specialAttackpoisonColor;
      }
    }
    context.fillRect(
      this.currentPosition.x,
      this.currentPosition.y - 8,
      this.enemyParams.width! * (this.enemyParams.hp / this.enemyParams.maxHp!),
      8,
    );
    context.strokeStyle = "black";
    context.strokeRect(
      this.currentPosition.x,
      this.currentPosition.y - 8,
      this.enemyParams.width! * (this.enemyParams.hp / this.enemyParams.maxHp!),
      8,
    );
    context.closePath();
  }

  public drawEnemyWithSprite(
    enemySprite: CanvasImageSource,
    context: CanvasRenderingContext2D = this.engine.context!.enemy!,
  ) {
    if (!enemySprite) return;
    context.beginPath();
    context.drawImage(
      enemySprite,
      this.currentPosition.x,
      this.currentPosition.y,
      this.enemyParams.width!,
      this.enemyParams.height!,
    );
    context.closePath();
  }

  public getNextFrameIndex(limit: number = this.renderParams.framesPerSprite) {
    let frame = 0;
    if (this.renderParams.currentFrame < limit - 1) {
      this.renderParams.currentFrame += 1;
      frame = this.renderParams.currentFrame;
    } else {
      if (this.renderParams.isAnimateDeath) {
        return limit - 1;
      }
      this.renderParams.currentFrame = 0;
      frame = this.renderParams.currentFrame;
    }
    return frame;
  }

  public draw(context: CanvasRenderingContext2D, isDrawHpBar: boolean) {
    if (isDrawHpBar) {
      // hp bar
      this.drawHpBar();
    }
    // enemy 2d representation
    // enemy is alive, draw movement animation
    if (!this.renderParams.isAnimateDeath) {
      this.drawEnemyWithSprite(
        this.engine.enemySprites[this.enemyParams.type!]!.canvasArr![
          this.engine.map?.stageArr.at(
            this.currentStage !== this.engine.map?.stageArr?.length - 1
              ? this.currentStage
              : this.currentStage - 1,
          )!.direction!
        ]![
          this.enemyParams!.modifiedShockTimer
            ? this.renderParams.currentFrame
            : this.getNextFrameIndex()
        ],
        context,
      );
      // enemy is dead? draw death animation
    } else {
      if (this !== null) {
        this.drawEnemyWithSprite(
          this.engine.enemySprites[this.enemyParams.type!]!.canvasArr![
            `${this.engine.map?.stageArr.at(this.currentStage)!.direction!}Dead`
          ]![
            this.getNextFrameIndex(
              this.engine.enemySprites[this.enemyParams.type!]
                ?.deathFramesPerSprite,
            )
          ],
          context,
        );
      }
    }
  }

  public initialSetEnemy(initialPosition: ITwoDCoordinates = { x: 0, y: 0 }) {
    // set initial coords of enemy
    this.currentPosition.x =
      this.engine.map?.stageArr.at(0)?.limit.x! +
      this.randomOffset.x +
      initialPosition.x;
    this.currentPosition.y =
      this.engine.map?.stageArr.at(0)?.limit.y! +
      this.randomOffset.y +
      initialPosition.y;
  }

  public moveRight() {
    // increment x, y is constant
    this.currentPosition.x += this.enemyParams.speed!;
  }

  public moveLeft() {
    // increment y, x is constant
    this.currentPosition.x -= this.enemyParams.speed!;
  }

  public moveDown() {
    // increment y, x is constant
    this.currentPosition.y += this.enemyParams.speed!;
  }

  public moveUp() {
    // increment y, x is constant
    this.currentPosition.y -= this.enemyParams.speed!;
  }

  public getStage = (stageIndex = this.currentStage) => {
    return this.engine.map?.stageArr.at(stageIndex);
  };

  // enemy movement logic
  public move() {
    const currentStage = this.getStage();
    if (!currentStage) return;
    switch (currentStage.direction) {
      case "start": {
        this.currentStage += 1;
        break;
      }
      case "right": {
        if (
          this.currentPosition.x <=
          currentStage.limit.x - this.engine.map!.mapParams.gridStep // + this.randomOffset.x
        ) {
          this.moveRight();
        } else {
          if (this.currentStage + 1 !== this.engine.map?.stageArr?.length) {
            this.currentStage += 1;
          }
        }
        break;
      }
      case "left": {
        if (
          this.currentPosition.x >= currentStage.limit.x // + this.randomOffset.x
        ) {
          this.moveLeft();
        } else {
          if (this.currentStage + 1 !== this.engine.map?.stageArr?.length) {
            this.currentStage += 1;
          }
        }
        break;
      }
      case "down": {
        if (
          this.currentPosition.y <=
          currentStage.limit.y -
            this.engine.map!.mapParams.gridStep +
            this.randomOffset.y
        ) {
          this.moveDown();
        } else {
          if (this.currentStage + 1 !== this.engine.map?.stageArr?.length) {
            this.currentStage += 1;
          }
        }
        break;
      }
      case "up": {
        if (
          this.currentPosition.y + this.engine.map!.mapParams.gridStep >=
          currentStage.limit.y + this.randomOffset.y
        ) {
          this.moveUp();
        } else {
          if (this.currentStage + 1 !== this.engine.map?.stageArr?.length) {
            this.currentStage += 1;
          }
        }
        break;
      }
      case "end": {
        const prevStage = this.getStage(this.currentStage - 1)!;
        switch (prevStage.direction) {
          case "left": {
            if (
              this.currentPosition.x + this.enemyParams.width! >=
              currentStage.limit.x + this.randomOffset.x
            ) {
              this.moveLeft();
            } else {
              // end of map
              this.destroy(false, false);
              // decrement life quantity
              this.engine.lives -= 1;
              // UI
              useGameStore.getState().updateLives(this.engine.lives);
            }
            break;
          }
          case "right": {
            if (
              this.currentPosition.x <
              currentStage.limit.x - this.randomOffset.x
            ) {
              this.moveRight();
            } else {
              // end of map
              this.destroy(false, false);
              // decrement life quantity
              this.engine.lives -= 1;
              // UI
              useGameStore.getState().updateLives(this.engine.lives);
            }
            break;
          }
          case "down": {
            if (
              this.currentPosition.y + this.enemyParams.height! <=
              currentStage.limit.y + this.randomOffset.y
            ) {
              this.moveDown();
            } else {
              // end of map
              this.destroy(false, false);
              // decrement life quantity
              this.engine.lives -= 1;
              // UI
              useGameStore.getState().updateLives(this.engine.lives);
            }
            break;
          }
          case "up": {
            if (
              this.currentPosition.y - this.enemyParams.height! <=
              currentStage.limit.y + this.randomOffset.y
            ) {
              this.moveUp();
            } else {
              // end of map
              this.destroy(false, false);
              // decrement life quantity
              this.engine.lives -= 1;
              // UI
              useGameStore.getState().updateLives(this.engine.lives);
            }
            break;
          }
        }
      }
    }
  }

  public destroy(isPushDeadEnemy = true, isGiveBounty = true) {
    // pop en enemy
    this.engine.enemies = this.engine.enemies?.filter(
      (enemy: Enemy) => this !== enemy,
    );

    // push enemy to dead enemies
    if (isPushDeadEnemy) {
      this.engine.deadEnemies!.push(this);
    }

    // release tower target
    for (const tower of this.engine.towers!) {
      if (tower.target === this) {
        tower.target = null;
      }
    }

    this.engine.score += 1;
    if (isGiveBounty) {
      if (
        this.engine.money + this.enemyParams.bounty! <
        this.engine.initialGameParams.maxMoney
      ) {
        this.engine.money += this.enemyParams.bounty!;
        useGameStore.getState().updateMoney(this.engine.money);
        useGameStore.getState().updateScore(this.engine.score);
      }
    }

    // UI update
    useGameStore.getState().updateEnemiesLeft(this.engine.enemies?.length!);
  }
}
