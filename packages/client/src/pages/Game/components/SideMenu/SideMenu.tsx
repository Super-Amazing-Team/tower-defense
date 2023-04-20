import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import cursorHand from "../../../../../public/UI/cursorHand.png";
import sidePanelBg from "@/../public/UI/sidePanelBg.png";
import { ColorDict, TDEngine } from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";

const percentToProgressBarString = (percent: number) => {
  const progress = Math.floor(percent / 10);
  return `[${"x".repeat(progress)}${"o".repeat(10 - progress)}]`;
};

interface ISideMenu {
  engine: TDEngine;
}
export const SideMenu = ({ engine }: ISideMenu) => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useGameStore(
    (state) => [state.isSideMenuOpen, state.updateIsSideMenuOpen],
    shallow,
  );
  const selectedTower = useGameStore((state) => state.selectedTower, shallow);
  const constructionProgress = useGameStore(
    (state) => state.constructionProgress,
    shallow,
  );
  return (
    <>
      {/* UI side menu */}
      <Box
        sx={{
          position: "absolute",
          right: isSideMenuOpen ? "0px" : `-${engine.map?.tileToNumber(4)}px`,
          zIndex: engine.canvasZIndex.build + 1,
          width: `${engine.map?.tileToNumber(4)}px`,
          height: "100%",
          transition: "all 500ms ease",
          userSelect: "none",
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
              borderLeft: `3px solid ${ColorDict.borderColor}`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "16px",
                right: "16px",
                fontSize: "1.5em",
                cursor: `url("${cursorHand}"), auto`,
              }}
            >
              <Typography
                onClick={() => {
                  // toggle side menu
                  setIsSideMenuOpen(!isSideMenuOpen);
                  // clear tower selection
                  engine.clearTowerSelection(engine.selectedTower!);
                }}
              >
                X
              </Typography>
            </Box>
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
                      "& > p > span": {
                        float: "right",
                      },
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
                    {selectedTower?.projectileParams?.attackModifier && (
                      <>
                        <Typography>
                          Special:
                          <Box
                            component="span"
                            sx={{
                              color:
                                ColorDict[
                                  `specialAttack${selectedTower?.projectileParams?.attackModifier}Color`
                                ] + " !important",
                            }}
                          >
                            {selectedTower?.projectileParams?.attackModifier}
                          </Box>
                        </Typography>
                        {selectedTower?.projectileParams
                          ?.attackModifierTimeout && (
                          <Typography>
                            Duration:
                            <Box
                              component="span"
                              sx={{
                                color:
                                  ColorDict[
                                    `specialAttack${selectedTower?.projectileParams?.attackModifier}Color`
                                  ] + " !important",
                              }}
                            >
                              {
                                selectedTower?.projectileParams
                                  ?.attackModifierTimeout
                              }
                            </Box>
                          </Typography>
                        )}
                        {selectedTower?.projectileParams
                          ?.attackModifierRange && (
                          <Typography>
                            Range:
                            <Box
                              component="span"
                              sx={{
                                color:
                                  ColorDict[
                                    `specialAttack${selectedTower?.projectileParams?.attackModifier}Color`
                                  ] + " !important",
                              }}
                            >
                              {
                                selectedTower?.projectileParams
                                  ?.attackModifierRange
                              }
                            </Box>
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      mt: "2em",
                      "& button": {
                        cursor: `url("${cursorHand}"), auto`,
                      },
                    }}
                  >
                    <Button
                      disabled={
                        selectedTower?.upgradeLevel! ===
                          selectedTower?.towerParams.maxUpgradeLevel! ||
                        !engine.isEnoughMoney(
                          selectedTower?.towerParams.price! *
                            (selectedTower!.upgradeLevel + 1),
                        )
                      }
                      onClick={() => {
                        engine.upgradeTower(selectedTower!);
                      }}
                    >
                      Upgrade tower(
                      {selectedTower
                        ? `${
                            selectedTower?.towerParams.price! *
                            (selectedTower!.upgradeLevel + 1)
                          }$`
                        : ""}
                      )
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
