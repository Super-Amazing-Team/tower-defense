import { useEffect } from "react";
import CSSBaseLine from "@mui/material/CssBaseline";
import { Box, Grid, Typography, Button } from "@mui/material";

import { useBearsStore } from "@/store";

function DummyTestComponent() {
  const bears = useBearsStore((store) => store.bears);
  const addOne = useBearsStore((store) => store.addOne);
  const resetPopulation = useBearsStore((store) => store.resetPopulation);

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ height: "100%" }}
      >
        <Typography>Вот сколько медведей мы сосчитали: {bears}</Typography>
        <Box>
          <Button variant="contained" onClick={addOne}>
            Сосчитать еще одного
          </Button>
          <Button color="error" onClick={resetPopulation}>
            Начать заново
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}

function App() {
  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    };

    fetchServerData();
  }, []);
  return (
    <CSSBaseLine>
      <DummyTestComponent />
    </CSSBaseLine>
  );
}

export default App;
