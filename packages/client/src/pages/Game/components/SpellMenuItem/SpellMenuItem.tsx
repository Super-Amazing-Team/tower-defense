import { Box, Typography } from "@mui/material";
import { shallow } from "zustand/shallow";
import { memo } from "react";
import spellIconsSprite from "../../../../../public/UI/spellIconsSprite.png";
import { TDEngine, TSpellTypes } from "@/pages/Game/engine/TDEngine";
import { useGameStore } from "@/store";

export interface ISpellMenuItem {
  engine: TDEngine;
  spellType: TSpellTypes;
  index: number;
  isDisabled: boolean;
}

export const SpellMenuItem = memo(
  ({ engine, spellType, index, isDisabled }: ISpellMenuItem) => {
    const setIsBuildMenuOpen = useGameStore(
      (state) => state.updateIsBuildMenuOpen,
      shallow,
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
          margin: "0px 4px 8px",
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
          <Typography>
            {engine.predefinedSpellParams[spellType].spellParams.manaCost!}
          </Typography>
        </Box>
      </Box>
    );
  },
);
