import React from "react";
import { Box, Typography } from "@mui/material";
import { ITowerSprite, TTowerTypes } from "@/pages/Game/engine/TDEngine";
import { Tower } from "@/pages/Game/towers/Tower";

interface IBuildMenuTower {
  tower: {
    towerParams: Tower["towerParams"];
    projectileParams: Tower["projectileParams"];
  };
  towerType: TTowerTypes;
  towerCanvas: ITowerSprite["canvasArr"];
  onClick: Function;
}
export const BuildMenuTower = ({
  tower,
  towerType,
  towerCanvas,
  onClick,
}: IBuildMenuTower) => {
  return (
    <Box
      sx={{
        cursor: "pointer",
        border: "2px solid #bd6a62",
        margin: "16px",
        padding: "16px",
        borderRadius: "16px",
        fontSize: "0.7em",
        textAlign: "center",
      }}
      className="b-build-menu-tower-wrapper"
      onClick={() => {
        onClick();
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
              top: "-20px",
              "& > .tower-base": {
                width: `${tower.towerParams?.baseWidth}px`,
                height: `${tower.towerParams?.baseHeight}px`,
              },
            }}
            className="b-tower-image"
          >
            <Box
              sx={{
                background: `url(${(
                  towerCanvas!.weapon[0] as HTMLCanvasElement[]
                )[0].toDataURL()}) 0 0 no-repeat`,
                zIndex: 2,
                width: `${tower.towerParams?.dimensions[0].cannonWidth}px`,
                height: `${tower.towerParams?.dimensions[0].cannonHeight}px`,
                position: "absolute",
                left: `${Math.floor(
                  (tower.towerParams?.baseWidth -
                    tower.towerParams?.dimensions[0].cannonWidth) /
                    2,
                )}px`,
                top: `${Math.floor(
                  (tower.towerParams?.baseHeight -
                    tower.towerParams?.dimensions[0].cannonHeight -
                    tower.towerParams?.dimensions[0].cannonOffsetY) /
                    2,
                )}px`,
              }}
              className="tower-cannon"
            />
            <Box
              sx={{
                background: `url(${(
                  towerCanvas!.base[0] as HTMLCanvasElement
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
            "& span": {
              color: "red",
              fontSize: "1em",
            },
          }}
        >
          <Typography>
            Damage:<span>{tower.towerParams?.attackDamage}</span>
          </Typography>
          <Typography>
            Speed:<span>{tower.towerParams?.attackRate}</span>
          </Typography>
          <Typography>
            Range:<span>{tower.towerParams?.attackRange}</span>
          </Typography>
          <Typography>
            Price:<span>{tower.towerParams?.price}</span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
