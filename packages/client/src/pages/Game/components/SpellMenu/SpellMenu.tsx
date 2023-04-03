import { Box, Typography, Stack } from "@mui/material";
import { shallow } from "zustand/shallow";
import { memo } from "react";
import spellIconsSprite from "@/../public/sprites/spells/spellIconsSprite.png";
import { TDEngine, TSpellTypes } from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";
export interface ISpellMenu {
  engine: TDEngine;
}
export const SpellMenu = memo(({ engine }: ISpellMenu) => {
  const [isBuildMenuOpen, setIsBuildMenuOpen] = useGameStore(
    (state) => [state.isBuildMenuOpen, state.updateIsBuildMenuOpen],
    shallow,
  );

  return (
    <Box>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: "16px",
        }}
      >
        {Object.entries(engine.predefinedSpellParams).map((spell, index) => {
          const spellType: TSpellTypes = spell[0] as TSpellTypes;
          const isDisabled = !engine.isEnoughMana(
            spell[1].spellParams.manaCost!,
          );
          return (
            <Box
              key={`spell-menu-spell-${spellType}`}
              onClick={() => {
                if (!isDisabled) {
                  setIsBuildMenuOpen(false);
                  engine.castSpell(spellType);
                }
              }}
              sx={{
                margin: "0px 16px 8px",
                "&.state__disabled": {
                  opacity: ".7",
                },

                "&.state__disabled div:hover": {
                  border: "2px solid #bd6a62",
                  cursor: "not-allowed",
                },
              }}
              className={
                isDisabled
                  ? "b-spell-menu-wrapper state__disabled"
                  : "b-spell-menu-wrapper"
              }
            >
              <Box
                sx={{
                  width: `${engine.predefinedSpellParams[spellType].spell.width}px`,
                  height: `${engine.predefinedSpellParams[spellType].spell.height}px`,
                  background: `url(${spellIconsSprite}) ${
                    -index * (64 - 4)
                  }px 0 no-repeat`,
                  backgroundSize: "cover",
                  border: "2px solid #bd6a62",
                  borderRadius: "16px",
                  transition: "300ms all ease",
                  "& p": {
                    padding: "8px",
                    color: "white",
                    textAlign: "right",
                  },
                  "&:hover": {
                    cursor: "pointer",
                    border: "2px solid white",
                  },
                  "&:hover p": {},
                }}
              >
                <Typography>{spell[1].spellParams.manaCost!}</Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
});
