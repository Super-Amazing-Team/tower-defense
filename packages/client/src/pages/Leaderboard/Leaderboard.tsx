import { useEffect, useState } from "react";
import {
  Table,
  Container,
  Typography,
  TableFooter,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { useLeaderboardStore } from "@/store/LeaderboardStore";

export function Leaderboard() {
  const [rowsPerPage, setRowsPerPage] = useState("5");
  const leaderboardAll = useLeaderboardStore((store) => store.leaderboardAll);
  const getLeaderboardAll = useLeaderboardStore(
    (store) => store.getLeaderboardAll,
  );

  useEffect(() => {
    getLeaderboardAll({
      ratingFieldName: "score",
      cursor: 0,
      limit: parseInt(rowsPerPage, 10),
    });
  }, [getLeaderboardAll, rowsPerPage]);

  const handleChange = (event: SelectChangeEvent) => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Container
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5" mb={4}>
        Лидерборд
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Позиция</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Очки</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(leaderboardAll) &&
              leaderboardAll.map(({ data: row }, index) => {
                const key = `${row.score} ${index}`;
                return (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ maxWidth: "300px" }}>
                      <Typography noWrap>
                        {row.name || row.username || row.login || ""}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.score}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell padding="none">
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={2}
                >
                  <Typography>Показывать по</Typography>
                  <Select
                    value={rowsPerPage}
                    onChange={handleChange}
                    variant="standard"
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                  </Select>
                </Stack>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
}
