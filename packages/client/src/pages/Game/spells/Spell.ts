import {
  ITwoDCoordinates,
  TDEngine,
  TSpellTypes,
} from "@/pages/Game/engine/TDEngine";
import { Enemy, IEnemy } from "@/pages/Game/enemies/Enemy";
import { TProjectileAttackModifiers } from "@/pages/Game/towers/Tower";

export interface ISpell {
  engine: TDEngine;
  spellType: TSpellTypes;
  spellParams: {
    attackDamage: number;
    attackRange: number;
    movementSpeed: number;
    manaCost: number;
    attackModifierTimeout?: number;
    attackModifier?: TProjectileAttackModifiers;
    currentPosition?: ITwoDCoordinates;
    collisionPoint?: ITwoDCoordinates;
    width?: number;
    height?: number;
  };
  renderParams: {
    isMoving: boolean;
    isAnimateImpact: boolean;
    animationImpactTimer: NodeJS.Timer | null;
    currentFrame: number;
  };
}
export class Spell {
  constructor(
    public engine: IEnemy["engine"],
    public spellType: ISpell["spellType"] = "fireball",
    public spellParams: ISpell["spellParams"] = {
      currentPosition: { x: 0, y: 0 },
      collisionPoint: { x: 0, y: 0 },
      attackDamage: 80,
      attackRange: 80,
      attackModifier: undefined,
      attackModifierTimeout: 1000,
      movementSpeed: 2,
      manaCost: 90,
    },
    public renderParams: ISpell["renderParams"] = {
      isMoving: true,
      isAnimateImpact: false,
      animationImpactTimer: null,
      currentFrame: 0,
    },
  ) {}

  // spell 2d representation
  public draw(context: CanvasRenderingContext2D = this.engine.context?.spell!) {
    // spell is moving
    if (!this.renderParams.isAnimateImpact) {
      context.drawImage(
        this.engine.spellSprites[this.spellType!]?.canvasArr?.spell![
          this.getNextFrameIndex()
        ]!,
        0,
        0,
        this.engine.predefinedSpellParams[this.spellType!]?.spell.width,
        this.engine.predefinedSpellParams[this.spellType!]?.spell.height,
        this.spellParams.currentPosition!.x,
        this.spellParams.currentPosition!.y,
        this.engine.predefinedSpellParams[this.spellType!]?.spell.width,
        this.engine.predefinedSpellParams[this.spellType!]?.spell.height,
      );
    } else {
      // collision animation
      context.drawImage(
        this.engine.spellSprites[this.spellType!]?.canvasArr?.impact![
          this.getNextFrameIndex(
            this.engine.predefinedSpellParams[this.spellType!]!.impact
              .framesPerSprite,
          )
        ]!,
        0,
        0,
        this.engine.predefinedSpellParams[this.spellType!]?.impact.width,
        this.engine.predefinedSpellParams[this.spellType!]?.impact.height,
        this.spellParams.collisionPoint!.x,
        this.spellParams.collisionPoint!.y,
        this.engine.predefinedSpellParams[this.spellType!]?.impact.width,
        this.engine.predefinedSpellParams[this.spellType!]?.impact.height,
      );
    }
  }

  public getNextFrameIndex(
    limit: number = this.engine.predefinedSpellParams[this.spellType!]!.spell
      .framesPerSprite,
  ) {
    if (!this.renderParams.isAnimateImpact) {
      if (this.renderParams.currentFrame < limit - 1) {
        this.renderParams.currentFrame += 1;
      } else {
        if (this.renderParams.isAnimateImpact) {
          return limit - 1;
        }
        this.renderParams.currentFrame = 0;
      }
    } else {
      if (this.renderParams.currentFrame < limit - 1) {
        this.renderParams.currentFrame += 1;
      } else {
        this.destroy();
        this.renderParams.isAnimateImpact = false;
      }
    }
    return this.renderParams.currentFrame;
  }

  public move() {
    // is moving
    if (
      this.spellParams.currentPosition!.x !==
        this.spellParams.collisionPoint!.x &&
      this.spellParams.currentPosition!.y !== this.spellParams.collisionPoint!.y
    ) {
      this.spellParams.currentPosition!.x += this.spellParams.movementSpeed;
      this.spellParams.currentPosition!.y += this.spellParams.movementSpeed;
      // collision
    } else {
      this.collision();
      this.renderParams.isMoving = false;
      this.renderParams.currentFrame = 0;
      this.renderParams.isAnimateImpact = true;
    }
    if (
      this.spellParams.currentPosition!.x >
        this.engine.map?.mapParams?.width! ||
      this.spellParams.currentPosition!.y > this.engine.map?.mapParams?.height!
    ) {
      this.destroy();
    }
  }

  public drawDraft(
    context: CanvasRenderingContext2D = this.engine.context?.spellDraft!,
  ) {
    // draw spell range
    this.drawSpellRange();
    context.drawImage(
      this.engine.spellSprites[this.spellType!]?.canvasArr?.spell![
        this.getNextFrameIndex()
      ]!,
      0,
      0,
      this.engine.predefinedSpellParams[this.spellType!]?.spell.width,
      this.engine.predefinedSpellParams[this.spellType!]?.spell.height,
      this.engine.cursorPosition!.x - 32,
      this.engine.cursorPosition!.y - 32,
      this.engine.predefinedSpellParams[this.spellType!]?.spell.width,
      this.engine.predefinedSpellParams[this.spellType!]?.spell.height,
    );
  }

  public drawSpellRange(
    context: CanvasRenderingContext2D = this.engine.context?.spellDraft!,
  ) {
    // set draw style
    context.beginPath();
    context.lineWidth = 1;
    // context.setLineDash([10, 15]);
    context.fillStyle = "blue";
    // draw tower range
    context.arc(
      this.engine.cursorPosition.x,
      this.engine.cursorPosition.y,
      this.spellParams.attackRange,
      0,
      360,
    );
    context.fill();
    context.closePath();
  }

  public isEnemyInRange(enemy: Enemy) {
    const xDistance =
      this.spellParams.currentPosition!.x +
      this.engine.predefinedSpellParams[this.spellType].spell.width! / 2 -
      (enemy.currentPosition.x + enemy.enemyParams.width! / 2);
    const yDistance =
      this.spellParams.currentPosition!.y +
      this.engine.predefinedSpellParams[this.spellType].spell.height! / 2 -
      (enemy.currentPosition.y + enemy.enemyParams.height! / 2);
    if (Math.hypot(xDistance, yDistance) < this.spellParams.attackRange) {
      return true;
    }
    return false;
  }

  public collision() {
    if (this.engine.enemies?.length) {
      if (!this.spellParams.attackModifier) {
        this.engine.enemies.forEach((enemy) => {
          if (this.isEnemyInRange(enemy)) {
            enemy.enemyParams.hp -= this.spellParams.attackDamage;
            if (enemy.enemyParams.hp <= 0) {
              // target is dead
              enemy.renderParams!.currentFrame = 0;
              enemy.renderParams!.isAnimateDeath = true;
              enemy.destroy();
            }
          }
        });
      } else {
        if (this.spellParams.attackModifier === "slow") {
          this.engine.enemies?.forEach((enemy) => {
            if (this.isEnemyInRange(enemy)) {
              enemy.enemyParams.hp -= this.spellParams.attackDamage;

              // target is dead
              if (enemy.enemyParams.hp <= 0) {
                enemy.renderParams!.currentFrame = 0;
                enemy.renderParams!.isAnimateDeath = true;
                enemy.destroy();
              } else {
                // target is alive
                // if we already have slow attack modifier timer, reset it
                if (enemy.enemyParams.modifiedSlowTimer) {
                  clearTimeout(enemy.enemyParams!.modifiedSlowTimer);
                  enemy.enemyParams!.modifiedSlowTimer = null;
                }
                if (!enemy.enemyParams.isModified) {
                  enemy.enemyParams!.speed! -= enemy.enemyParams!.speed! * 0.4;
                  enemy.enemyParams.isModified = true;
                  enemy.enemyParams.attackModifier = "slow";
                }
                enemy.enemyParams!.modifiedSlowTimer = setTimeout(() => {
                  // clear timer
                  enemy.enemyParams!.modifiedSlowTimer = null;
                  clearTimeout(enemy.enemyParams?.modifiedSlowTimer!);
                  // restore enemy movement speed
                  enemy.enemyParams!.speed = enemy.enemyParams?.initialSpeed;
                  // restore enemy isModified state to false
                  enemy.enemyParams.isModified = false;
                }, this.spellParams.attackModifierTimeout);
              }
            }
          });
        }
      }
    }
  }

  public destroy() {
    // pop en enemy
    this.engine.spells = this.engine.spells?.filter(
      (spell: Spell) => this !== spell,
    );
  }
}
