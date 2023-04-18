import { Box, Typography } from "@mui/material";
import { ColorDict, TDEngine, TTowerTypes } from "@/pages/Game/engine/TDEngine";
import cursorNotAllowed from "@/../public/UI/cursorNotAllowed.png";
import cursorHand from "@/../public/UI/cursorHand.png";
import grassBg from "@/../public/sprites/map/grassBg.png";
import { TowerImage } from "@/pages/Game/components/TowerImage/TowerImage";
interface IBuildMenuTower {
  engine: TDEngine;
  towerType: TTowerTypes;
  isDisabled: boolean;
}
export const BuildMenuTower = ({
  engine,
  towerType,
  isDisabled,
}: IBuildMenuTower) => {
  return (
    <Box
      sx={{
        cursor: `url("${isDisabled ? cursorNotAllowed : cursorHand}"), auto`,
        border: "2px solid #bd6a62",
        margin: "16px",
        padding: "16px 16px 0",
        borderRadius: "16px",
        fontSize: "0.7em",
        textAlign: "center",
        transition: "all 300ms ease",
        "&:hover": {
          border: "2px solid #262626",
          background: `url(${grassBg}) 0 0 repeat`,
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
        <TowerImage engine={engine} towerType={towerType} upgradeLevel={0} />
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
                color: ColorDict.specialAttackslowColor,
              },
              "& .b-attack-modifier-shock": {
                color: ColorDict.specialAttackshockColor,
              },
              "& .b-attack-modifier-splash": {
                color: ColorDict.specialAttacksplashColor,
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
};
