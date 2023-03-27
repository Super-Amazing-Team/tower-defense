import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import sidePanelBg from "../../../../../public/UI/sidePanelBg.png";
import { TDEngine, TTowerTypes } from "@/pages/Game/engine/TDEngine";
import { BuildMenuTower } from "@/pages/Game/components/BuildMenuTower/BuildMenuTower";
import { useGameStore } from "@/store";

interface IBuildMenu {
  engine: TDEngine;
}
export const BuildMenu = ({ engine }: IBuildMenu) => {
  const [isGameStarted, setIsGameStarted] = useGameStore(
    (state) => [state.isGameStarted, state.updateIsGameStarted],
    shallow,
  );
  const [isGameMenuOpen, setIsGameMenuOpen] = useGameStore(
    (state) => [state.isGameMenuOpen, state.updateIsGameMenuOpen],
    shallow,
  );
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useGameStore(
    (state) => [state.isBuildMenuOpen, state.updateIsBuildMenuOpen],
    shallow,
  );

  return isGameStarted ? (
    <Box
      sx={{
        display: "flex",
        zIndex: 100,
        position: "absolute",
        width: "100%",
        height: `${engine.map?.tileToNumber(4)}px`,
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
            <BuildMenuTower
              key={`build-menu-tower-tower-${towerType}`}
              tower={tower[1]}
              towerType={towerType}
              towerCanvas={engine.towerSprites[towerType]!.canvasArr}
              onClick={() => {
                setIsBuildMenuOpen(false);
                engine.buildTower(towerType, 0);
              }}
              grassBg={engine.map?.grassBackrgroundCanvas?.toDataURL()}
              isDisabled={!engine.isEnoughMoney(tower[1].towerParams.price!)}
            />
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
            cursor: "pointer",
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
        >
          X
        </Typography>
      </Box>
    </Box>
  ) : (
    <div />
  );
};
