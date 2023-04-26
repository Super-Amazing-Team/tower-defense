import { Box, CircularProgress } from "@mui/material";
import { TDEngine, TSpellTypes } from "@/pages/Game/engine/TDEngine";

export interface ISpellImage {
  engine: TDEngine;
  spellType: TSpellTypes;
}

export const SpellImage = ({ engine, spellType }: ISpellImage) => {
  return engine.isInitialized ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="b-spell-image-wrapper"
    >
      <Box
        sx={{
          background: `url(${
            engine.spellSprites[spellType]!.spriteSource!.src
          }) 0 0 no-repeat`,
          width: `${engine.predefinedSpellParams[spellType].spell.width}px`,
          height: `${engine.predefinedSpellParams[spellType].spell.height}px`,
        }}
        className="b-spell-image"
      />
    </Box>
  ) : (
    <CircularProgress />
  );
};
