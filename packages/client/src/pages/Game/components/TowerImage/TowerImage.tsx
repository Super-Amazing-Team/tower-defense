import { Box, CircularProgress } from "@mui/material";
import { TDEngine, TTowerTypes } from "@/pages/Game/engine/TDEngine";

export interface ITowerImage {
  engine: TDEngine;
  towerType: TTowerTypes;
  upgradeLevel?: number;
}

export const TowerImage = ({
  engine,
  towerType,
  upgradeLevel = 0,
}: ITowerImage) => {
  return engine.isInitialized ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
      className="b-tower-image-wrapper"
    >
      <Box
        sx={{
          position: "relative",
          top: "-30px",
          "& > .tower-base": {
            width: `${engine.predefinedTowerParams[towerType].towerParams?.baseWidth}px`,
            height: `${engine.predefinedTowerParams[towerType].towerParams?.baseHeight}px`,
          },
        }}
        className="b-tower-image"
      >
        <Box
          sx={{
            background: `url(${
              (
                engine.towerSprites[towerType]!.spriteSource!
                  .weapon as HTMLImageElement[]
              )[upgradeLevel].src
            }) -${
              upgradeLevel *
              engine.predefinedTowerParams[towerType].towerParams?.dimensions[
                upgradeLevel
              ].cannonWidth
            }px 0px no-repeat`,
            zIndex: 2,
            width: `${engine.predefinedTowerParams[towerType].towerParams?.dimensions[upgradeLevel].cannonWidth}px`,
            height: `${engine.predefinedTowerParams[towerType].towerParams?.dimensions[upgradeLevel].cannonHeight}px`,
            position: "absolute",
            left: `${Math.floor(
              (engine.predefinedTowerParams[towerType].towerParams?.baseWidth -
                engine.predefinedTowerParams[towerType].towerParams?.dimensions[
                  upgradeLevel
                ].cannonWidth) /
                2,
            )}px`,
            top: `${Math.floor(
              (engine.predefinedTowerParams[towerType].towerParams?.baseHeight -
                engine.predefinedTowerParams[towerType].towerParams?.dimensions[
                  upgradeLevel
                ].cannonHeight -
                engine.predefinedTowerParams[towerType].towerParams?.dimensions[
                  upgradeLevel
                ].cannonOffsetY) /
                2 -
                upgradeLevel * 12,
            )}px`,
          }}
          className="tower-cannon"
        />
        <Box
          sx={{
            background: `url(${
              (
                engine.towerSprites[towerType]!.spriteSource!
                  .base as HTMLImageElement
              ).src
            }) -${
              upgradeLevel *
              engine.predefinedTowerParams[towerType].towerParams?.baseWidth
            }px 0 no-repeat`,
            zIndex: 1,
          }}
          className="tower-base"
        />
      </Box>
    </Box>
  ) : (
    <CircularProgress />
  );
};
