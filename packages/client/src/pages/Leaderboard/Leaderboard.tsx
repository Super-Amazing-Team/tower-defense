import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container, Typography } from "@mui/material";

function createData(position: number, name: string, points: number) {
  return { position, name, points };
}

const rows = [
  createData(1, "Frozen yoghurt", 159),
  createData(2, "Ice cream sandwich", 237),
  createData(3, "Eclair", 262),
  createData(4, "Cupcake", 305),
  createData(5, "Gingerbread", 356),
];

export function Leaderboard() {
  return (
    <Container>
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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.position}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
