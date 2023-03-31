import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import {
  ITowerSprite,
  TDEngine,
  TTowerTypes,
} from "@/pages/Game/engine/TDEngine";
import { Tower } from "@/pages/Game/towers/Tower";
import { useGameStore } from "@/store";

interface IBuildMenuTower {
  engine: TDEngine;
  towerType: TTowerTypes;
}
export const BuildMenuTower = memo(({ engine, towerType }: IBuildMenuTower) => {
  /*
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useGameStore(
    (state) => [state.isBuildMenuOpen, state.updateIsBuildMenuOpen],
    shallow,
  );
   */
  const isDisabled = !engine.isEnoughMoney(
    engine.predefinedTowerParams[towerType].towerParams.price!,
  );
  return (
    <Box
      sx={{
        cursor: `${isDisabled ? "not-allowed" : "pointer"}`,
        border: "2px solid #bd6a62",
        margin: "16px",
        padding: "16px 16px 0",
        borderRadius: "16px",
        fontSize: "0.7em",
        textAlign: "center",
        transition: "all 300ms ease",
        "&:hover": {
          border: "2px solid #262626",
          background: `url(${engine.map?.grassBackrgroundCanvas?.toDataURL()}) repeat`,
        },
        "&.state__disabled": {
          opacity: ".7",
          background: "#CCC",
        },
      }}
      className={
        isDisabled
          ? "b-build-menu-tower-wrapper state__disabled"
          : "b-build-menu-tower-wrapper"
      }
      onClick={() => {
        if (!isDisabled) {
          // setIsBuildMenuOpen(false);
          engine.buildTower(towerType, 0);
        }
      }}
    >
      <Box className="b-build-menu-tower">
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
                background: `url(${(
                  engine.towerSprites[towerType]!.canvasArr!
                    .weapon[0] as HTMLCanvasElement[]
                )[0].toDataURL()}) 0 0 no-repeat`,
                zIndex: 2,
                width: `${engine.predefinedTowerParams[towerType].towerParams?.dimensions[0].cannonWidth}px`,
                height: `${engine.predefinedTowerParams[towerType].towerParams?.dimensions[0].cannonHeight}px`,
                position: "absolute",
                left: `${Math.floor(
                  (engine.predefinedTowerParams[towerType].towerParams
                    ?.baseWidth -
                    engine.predefinedTowerParams[towerType].towerParams
                      ?.dimensions[0].cannonWidth) /
                    2,
                )}px`,
                top: `${Math.floor(
                  (engine.predefinedTowerParams[towerType].towerParams
                    ?.baseHeight -
                    engine.predefinedTowerParams[towerType].towerParams
                      ?.dimensions[0].cannonHeight -
                    engine.predefinedTowerParams[towerType].towerParams
                      ?.dimensions[0].cannonOffsetY) /
                    2,
                )}px`,
              }}
              className="tower-cannon"
            />
            <Box
              sx={{
                background: `url(${(
                  engine.towerSprites[towerType]!.canvasArr!
                    .base[0] as HTMLCanvasElement
                ).toDataURL()}) 0 0 no-repeat`,
                zIndex: 1,
              }}
              className="tower-base"
            />
          </Box>
        </Box>
        <Box
          className="b-build-menu-tower-description"
          sx={{
            position: "relative",
            top: "-16px",
            "& > p": {
              lineHeight: 2,
            },
            "& span": {
              color: "red",
              fontSize: "1em",
            },
          }}
        >
          <Typography>
            Damage:
            <span>
              {
                engine.predefinedTowerParams[towerType].towerParams
                  ?.attackDamage
              }
            </span>
          </Typography>
          <Typography>
            Speed:
            <span>
              {engine.predefinedTowerParams[towerType].towerParams?.attackRate}
            </span>
          </Typography>
          <Typography>
            Range:
            <span>
              {engine.predefinedTowerParams[towerType].towerParams?.attackRange}
            </span>
          </Typography>
          <Typography
            sx={{
              "& .b-attack-modifier-slow": {
                color: "#3B46DB",
              },
              "& .b-attack-modifier-shock": {
                color: "#402d19",
              },
              "& .b-attack-modifier-splash": {
                color: "#155800",
              },
            }}
          >
            Special:
            <span
              className={`b-attack-modifier-${engine.predefinedTowerParams[towerType].projectileParams?.attackModifier}`}
            >
              {engine.predefinedTowerParams[towerType].projectileParams
                ?.attackModifier
                ? engine.predefinedTowerParams[towerType].projectileParams
                    ?.attackModifier
                : "none"}
            </span>
          </Typography>
          <Typography>
            Price:
            <span>
              {engine.predefinedTowerParams[towerType].towerParams?.price}$
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});