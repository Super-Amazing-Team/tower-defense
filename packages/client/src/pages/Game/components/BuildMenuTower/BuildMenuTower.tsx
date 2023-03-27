import React from "react";
import { Box, Typography } from "@mui/material";
import { ITowerSprite, TTowerTypes } from "@/pages/Game/engine/TDEngine";
import { Tower } from "@/pages/Game/towers/Tower";

interface IBuildMenuTower {
  tower: {
    towerParams: Tower["towerParams"];
    projectileParams: Tower["projectileParams"];
  };
  towerCanvas: ITowerSprite["canvasArr"];
  onClick: Function;
  isDisabled: boolean;
  grassBg?: string;
}
export const BuildMenuTower = ({
  tower,
  towerCanvas,
  onClick,
  isDisabled,
  grassBg,
}: IBuildMenuTower) => {
  return (
    <Box
      sx={{
        cursor: `${isDisabled ? "not-allowed" : "pointer"}`,
        border: "2px solid #bd6a62",
        margin: "16px",
        padding: "16px",
        borderRadius: "16px",
        fontSize: "0.7em",
        textAlign: "center",
        transition: "all 300ms ease",
        "&:hover": {
          border: "2px solid #262626",
          background: `url(${grassBg}) repeat`,
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
          onClick();
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
            Damage:<span>{tower.towerParams?.attackDamage}</span>
          </Typography>
          <Typography>
            Speed:<span>{tower.towerParams?.attackRate}</span>
          </Typography>
          <Typography>
            Range:<span>{tower.towerParams?.attackRange}</span>
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
              className={`b-attack-modifier-${tower.projectileParams?.attackModifier}`}
            >
              {tower.projectileParams?.attackModifier
                ? tower.projectileParams?.attackModifier
                : "none"}
            </span>
          </Typography>
          <Typography>
            Price:<span>{tower.towerParams?.price}$</span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
