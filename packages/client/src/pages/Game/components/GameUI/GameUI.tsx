import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import gameUIIcons from "@/../public/UI/gameUIIcons.png";
import { TDEngine } from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";
import cursorHand from "@/../public/UI/cursorHand.png";
import cursorNotAllowed from "@/../public/UI/cursorNotAllowed.png";

interface IGameUI {
  engine: TDEngine;
}

export const GameUi = ({ engine }: IGameUI) => {
  // game status params
  const lives = useGameStore((state) => state.lives, shallow);
  const mana = useGameStore((state) => state.mana, shallow);
  const waveNumber = useGameStore((state) => state.waveNumber, shallow);
  const isGameMenuOpen = useGameStore((state) => state.isGameMenuOpen, shallow);
  const setIsGameMenuOpen = useGameStore(
    (state) => state.updateIsGameMenuOpen,
    shallow,
  );
  const isBuildMenuOpen = useGameStore(
    (state) => state.isBuildMenuOpen,
    shallow,
  );
  const setIsBuildMenuOpen = useGameStore(
    (state) => state.updateIsBuildMenuOpen,
    shallow,
  );
  const score = useGameStore((state) => state.score, shallow);
  const money = useGameStore((state) => state.money, shallow);
  const enemiesLeft = useGameStore((state) => state.enemiesLeft, shallow);
  //

  return (
    <>
      {/* UI Game icons */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 101,
          userSelect: "none",
          height: "100%",
        }}
        className="b-game-ui-wrapper"
      >
        <Box
          sx={{
            position: "relative",
            top: "8px",
            left: "8px",
            "& .icon": {
              height: "32px",
            },
            "& > .menu-icon": {
              cursor: `url("${cursorHand}"), auto`,
            },
            "& > .game-menu-icon": {
              background: `url(${gameUIIcons}) 0 0 no-repeat`,
              marginBottom: "16px",
            },
            "& > .game-build-icon": {
              background: `url(${gameUIIcons}) 0 -32px no-repeat`,
              marginBottom: "16px",
            },
            "& > .game-showel-icon": {
              background: `url(${gameUIIcons}) 0 -256px no-repeat`,
              marginBottom: "16px",
            },
            "& .icon.state__disabled": {
              cursor: `url("${cursorNotAllowed}"), auto`,
              opacity: 0.4,
            },
          }}
          className="b-game-ui"
        >
          <Box
            onClick={() => {
              // toggle game menu
              setIsGameMenuOpen(!isGameMenuOpen);
            }}
            className="game-menu-icon icon menu-icon"
          />
          <Box
            onClick={() => {
              if (!isGameMenuOpen) {
                // toggle game menu
                setIsBuildMenuOpen(!isBuildMenuOpen);
              }
            }}
            className={`game-build-icon icon menu-icon ${
              isGameMenuOpen ? "state__disabled" : ""
            }`}
          />
          <Box
            onClick={() => {
              if (
                !isGameMenuOpen &&
                engine.isEnoughMoney(engine.initialGameParams.cleanTilePrice)
              ) {
                // clean tile
                engine.cleanTile();
              }
            }}
            className={`game-showel-icon icon menu-icon ${
              isGameMenuOpen &&
              !engine.isEnoughMoney(engine.initialGameParams.cleanTilePrice)
                ? "state__disabled"
                : ""
            }`}
          />
          {/* UI Game status */}
          <Box
            className="b-game-status"
            sx={{
              "& .status-icon": {
                paddingLeft: "36px",
                paddingTop: "10px",
                marginBottom: "16px",
              },

              "& .status-icon p": {
                minWidth: "22px",
                color: "#262626",
                textAlign: "center",
              },
            }}
          >
            <Box
              sx={{
                background: `url(${gameUIIcons}) 0 -192px no-repeat`,
                "& p": {
                  color: "#262626",
                },
              }}
              className="game-mana-icon icon status-icon"
            >
              <Typography>{mana}</Typography>
            </Box>
            <Box
              sx={{
                background: `url(${gameUIIcons}) 0 -64px no-repeat`,
              }}
              className="game-money-icon icon status-icon"
            >
              <Typography>{money}</Typography>
            </Box>
            <Box
              sx={{
                background: `url(${gameUIIcons}) 0 -96px no-repeat`,
              }}
              className="game-lives-icon icon status-icon"
            >
              <Typography>{lives}</Typography>
            </Box>
            <Box
              sx={{
                background: `url(${gameUIIcons}) 0 -224px no-repeat`,
              }}
              className="game-enemies-left-icon icon status-icon"
            >
              <Typography>{enemiesLeft}</Typography>
            </Box>
            <Box
              sx={{
                background: `url(${gameUIIcons}) 0 -128px no-repeat`,
              }}
              className="game-wave-number-icon icon status-icon"
            >
              <Typography>{waveNumber}</Typography>
            </Box>
            <Box
              sx={{
                background: `url(${gameUIIcons}) 0 -160px no-repeat`,
              }}
              className="game-score-icon icon status-icon"
            >
              <Typography>{score}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
