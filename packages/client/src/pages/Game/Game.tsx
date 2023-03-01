import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import TDEngine, { TEnemyType, TTowerSpriteTypes } from "./engine/TDEngine";
import GameUi from "@/pages/Game/components/GameUI/GameUI";

export interface IGameProps extends PropsWithChildren {
  engine?: TDEngine;
}

export const Game: FC<IGameProps> = ({ engine = new TDEngine() }) => {
  // game window ref
  const gameWindow = useRef<HTMLDivElement>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    // engine init
    if (!engine.isInitialized) {
      engine.init(gameWindow.current!);
      // engine.map?.drawMap();
    }

    /* /DRAW BETWEEN ROUTES */
    /*
    // init level map draw
    engine.map?.drawMap();

    // draw towers
    if (engine.towers?.length) {
      engine.towers.forEach((tower) => {
        tower.draw();
      });
    }

    // draw enemies
    if (engine.enemies?.length) {
      engine.enemies?.forEach((enemy: Enemy) => {
        if (enemy.renderParams.isAnimateDeath) return;
        if (
          enemy.currentPosition.x +
            enemy.enemyParams.width! +
            enemy.randomOffset.x <
          0
        )
          return;
        enemy.draw(engine.context!.enemy!, true);
      });
    }

    // draw dead enemies
    if (engine.deadEnemies?.length) {
      engine.deadEnemies?.forEach((deadEnemy: Enemy) => {
        deadEnemy.draw(engine.context!.deadEnemy!, false);
      });
    }

    // draw projectiles
    if (engine.projectiles?.length) {
      engine.projectiles?.forEach((projectile: Projectile) => {
        projectile.draw();
      });
    }
    /* /DRAW BETWEEN ROUTES */

    /* LOAD SPRITES */
    // enemy sprites
    if (!engine.isEnemySpritesLoaded!) {
      for (const [enemyType, index] of Object.entries(engine.enemySprites)) {
        engine.splitEnemySprite(enemyType as TEnemyType);
      }
      engine.isEnemySpritesLoaded = true;
    }
    // tower sprites
    if (!engine.isTowerSpritesLoaded) {
      for (const [towerType, index] of Object.entries(engine.towerSprites)) {
        engine.splitTowerSprite(towerType as TTowerSpriteTypes);
      }
      engine.isTowerSpritesLoaded = true;
      // debug
      console.log(`engine`);
      console.log(engine);
      //
    }
    /* /LOAD SPRITES */

    // game start
    if (engine.isGameStarted) {
      engine.gameLoop();
      engine.gameLoopLogic();
      // add event listeners
      engine.addEventListeners();
    } else {
      engine.stopGame();
      // remove event listeners
      engine.removeEventListeners();
    }
    // componentWillUnmount
    return () => {
      // pause teh game
      engine.stopGame();
      // remove event listeners
      engine.removeEventListeners();
    };
  }, [isGameStarted]);

  return (
    <>
      <section className="b-game-window" id="gameWindow" ref={gameWindow} />
      <GameUi
        engine={engine}
        isGameStarted={isGameStarted}
        setIsGameStarted={setIsGameStarted}
      />
    </>
  );
};
