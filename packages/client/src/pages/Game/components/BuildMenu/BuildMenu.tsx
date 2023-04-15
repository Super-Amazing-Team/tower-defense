import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import sidePanelBg from "@/../public/UI/sidePanelBg.png";
import { TDEngine, TTowerTypes } from "@/pages/Game/engine/TDEngine";
import { BuildMenuTower } from "@/pages/Game/components/BuildMenuTower/BuildMenuTower";
import { useGameStore } from "@/store";
import { SpellMenu } from "@/pages/Game/components/SpellMenu/SpellMenu";
import cursorHand from "@/../public/UI/cursorHand.png";

interface IBuildMenu {
  engine: TDEngine;
}
export const BuildMenu = ({ engine }: IBuildMenu) => {
  const isGameStarted = useGameStore((state) => state.isGameStarted);
  const isGameMenuOpen = useGameStore((state) => state.isGameMenuOpen);
  const money = useGameStore((state) => state.money);
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useGameStore(
    (state) => [state.isBuildMenuOpen, state.updateIsBuildMenuOpen],
    shallow,
  );

  return (
    <Box
      sx={{
        display: isGameStarted ? "flex" : "none",
        zIndex: 100,
        position: "absolute",
        width: "100%",
        height: `${engine.map?.tileToNumber(4)}px`,
        left: 0,
        bottom:
          isBuildMenuOpen && !isGameMenuOpen
            ? "0px"
            : `-${engine.map?.tileToNumber(4)}px`,
        background: `url(${sidePanelBg}) repeat`,
        borderTop: "3px solid #bd6a62",
        transition: "all 500ms ease",
      }}
      className="b-tower-build-menu-wrapper"
    >
      <SpellMenu engine={engine} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          fontFamily: "'Press Start 2P', cursive",
        }}
        className="b-tower-build-menu-item"
      >
        {Object.entries(engine.predefinedTowerParams).map((tower, index) => {
          const towerType: TTowerTypes = tower[0] as TTowerTypes;
          return (
            <Box
              key={`build-menu-tower-${towerType}-wrapper`}
              onClick={() => {
                setIsBuildMenuOpen(false);
              }}
            >
              <BuildMenuTower
                key={`build-menu-tower-${towerType}`}
                engine={engine}
                towerType={towerType}
                isDisabled={
                  !engine.isEnoughMoney(
                    engine.predefinedTowerParams[towerType].towerParams.price!,
                    money,
                  )
                }
              />
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 101,
          "& > p": {
            cursor: `url("${cursorHand}"), auto`,
            width: "32px",
            height: "32px",
            textAlign: "center",
            fontSize: "1.5em",
            color: "#262626",
          },
        }}
      >
        <Typography
          onClick={() => {
            // toggle build menu
            setIsBuildMenuOpen(!isBuildMenuOpen);
          }}
          sx={{
            fontSize: "1.05em",
          }}
        >
          X
        </Typography>
      </Box>
    </Box>
  );
};
