import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import sidePanelBg from "../../../../../public/UI/sidePanelBg.png";
import { TDEngine } from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";

const percentToProgressBarString = (percent: number) => {
  let result = "[]";
  if (percent >= 0) {
    if (percent < 10) {
      result = "[xooooooooo]";
    } else if (percent < 20) {
      result = "[xxoooooooo]";
    } else if (percent < 30) {
      result = "[xxxooooooo]";
    } else if (percent < 40) {
      result = "[xxxxoooooo]";
    } else if (percent < 50) {
      result = "[xxxxxooooo]";
    } else if (percent < 60) {
      result = "[xxxxxxoooo]";
    } else if (percent < 70) {
      result = "[xxxxxxxooo]";
    } else if (percent < 80) {
      result = "[xxxxxxxxoo]";
    } else if (percent < 90) {
      result = "[xxxxxxxxxo]";
    } else if (percent <= 100) {
      result = "[xxxxxxxxxx]";
    }
  }
  return result;
};

interface ISideMenu {
  engine: TDEngine;
}
export const SideMenu = ({ engine }: ISideMenu) => {
  // menu store
  const [isGameMenuOpen, setIsGameMenuOpen] = useGameStore(
    (state) => [state.isGameMenuOpen, state.updateIsGameMenuOpen],
    shallow,
  );
  const [isSideMenuOpen, setIsSideMenuOpen] = useGameStore(
    (state) => [state.isSideMenuOpen, state.updateIsSideMenuOpen],
    shallow,
  );
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useGameStore(
    (state) => [state.isBuildMenuOpen, state.updateIsBuildMenuOpen],
    shallow,
  );
  const [selectedTower, setSelectedTower] = useGameStore(
    (state) => [state.selectedTower, state.updateSelectedTower],
    shallow,
  );
  const [constructionProgress, setConstructionProgress] = useGameStore(
    (state) => [state.constructionProgress, state.updateConstructionProgress],
    shallow,
  );
  return (
    <>
      {/* UI side menu */}
      <Box
        sx={{
          position: "absolute",
          right: isSideMenuOpen ? "0px" : `-${engine.map?.tileToNumber(4)}px`,
          zIndex: 100,
          width: `${engine.map?.tileToNumber(4)}px`,
          height: "100%",
          transition: "all 500ms ease",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
          }}
          className="b-tower-upgrade-menu-wrapper"
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: `url(${sidePanelBg}) repeat`,
              borderLeft: "3px solid #bd6a62",
            }}
          >
            <Box
              sx={{
                "& p:first-of-type": {
                  padding: "3em 1.5em 1em",
                },
                "& p": {
                  padding: "1em 1.5em",
                },
                "& span": {
                  color: "red",
                  fontSize: "1.2em",
                },
              }}
            >
              {selectedTower?.renderParams.isConstructing &&
              !selectedTower?.renderParams.isConstructionEnd ? (
                <>
                  <Typography
                    sx={{
                      mt: 3,
                    }}
                  >
                    Building:
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "red",
                      "& > span": {
                        fontSize: "1.6em",
                      },
                    }}
                  >
                    <span>
                      {percentToProgressBarString(constructionProgress)}
                    </span>
                  </Typography>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      mt: 3,
                    }}
                  >
                    <Typography>
                      Tower Level:{" "}
                      <span>{`${selectedTower?.upgradeLevel! + 1}`}</span>
                    </Typography>
                    <Typography>
                      Damage:{" "}
                      <span>{`${selectedTower?.towerParams?.attackDamage}`}</span>
                    </Typography>
                    <Typography>
                      Attack speed:{" "}
                      <Box component="span">{`${selectedTower?.towerParams?.attackRate}`}</Box>
                    </Typography>
                    <Typography>
                      Attack range:{" "}
                      <Box component="span">{`${selectedTower?.towerParams?.attackRange}`}</Box>
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", mt: "2em" }}
                  >
                    <Button
                      disabled={
                        selectedTower?.upgradeLevel! ===
                          selectedTower?.towerParams.maxUpgradeLevel! ||
                        !engine.isEnoughMoney(selectedTower?.towerParams.price)
                      }
                      onClick={() => {
                        engine.upgradeTower(selectedTower!);
                      }}
                    >
                      Upgrade tower(
                      {`${selectedTower?.towerParams.price}$`})
                    </Button>
                    <Button
                      onClick={() => {
                        engine.sellTower(engine.selectedTower!);
                      }}
                    >
                      Sell Tower(
                      {`${Math.floor(
                        (selectedTower?.towerParams?.price! *
                          (selectedTower?.upgradeLevel! + 1)) /
                          2,
                      )}$`}
                      )
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
