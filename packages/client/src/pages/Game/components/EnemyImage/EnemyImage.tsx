import { Box, CircularProgress } from "@mui/material";
import { TDEngine, TEnemyType } from "@/pages/Game/engine/TDEngine";

export interface IEnemyImage {
  engine: TDEngine;
  enemyType: TEnemyType;
}

export const EnemyImage = ({ engine, enemyType }: IEnemyImage) => {
  return engine.isInitialized ? (
    <Box
      sx={{
        background: `url("${engine.enemySprites[
          enemyType
        ]?.canvasArr?.right![0].toDataURL()}") 0 0 no-repeat`,
        minWidth: "64px",
        height: "64px",
        marginTop: "32px",
      }}
    />
  ) : (
    <CircularProgress />
  );
};
