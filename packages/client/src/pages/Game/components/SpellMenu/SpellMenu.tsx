import { Box, Stack } from "@mui/material";
import { TDEngine, TSpellTypes } from "@/pages/Game/engine/TDEngine";
import { SpellMenuItem } from "@/pages/Game/components/SpellMenuItem/SpellMenuItem";
export interface ISpellMenu {
  engine: TDEngine;
}
export const SpellMenu = ({ engine }: ISpellMenu) => {
  return (
    <Box
      sx={{
        width: "186px",
        ml: 2,
      }}
    >
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          mt: 2,
        }}
      >
        {Object.entries(engine.predefinedSpellParams).map((spell, index) => {
          const spellType: TSpellTypes = spell[0] as TSpellTypes;
          const isDisabled = !engine.isEnoughMana(
            spell[1].spellParams.manaCost!,
          );
          return (
            <SpellMenuItem
              key={`b-spell-item-${spellType}`}
              engine={engine}
              spellType={spellType}
              index={index}
              isDisabled={isDisabled}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
