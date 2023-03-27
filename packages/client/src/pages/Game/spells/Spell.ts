import {
  ITwoDCoordinates,
  TDEngine,
  TSpellTypes,
} from "@/pages/Game/engine/TDEngine";
import { IEnemy } from "@/pages/Game/enemies/Enemy";

export interface ISpell {
  engine: TDEngine;
  spellType: TSpellTypes;
  spellParams: {
    attackDamage: number;
    attackRange: number;
    movementSpeed: number;
    manaCost: number;
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
      movementSpeed: 2,
      manaCost: 90,
    },
    public renderParams: ISpell["renderParams"] = {
      isMoving: true,
      isAnimateImpact: false,
      animationImpactTimer: null,
      currentFrame: 0,
    },
  ) {
    // debug
    console.log(`this`);
    console.log(this);
    //
  }

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
      this.renderParams.isMoving = false;
      this.renderParams.currentFrame = 0;
      this.renderParams.isAnimateImpact = true;
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

  public destroy() {
    // pop en enemy
    this.engine.spells = this.engine.spells?.filter(
      (spell: Spell) => this !== spell,
    );
  }
}
