import { PropsWithChildren } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";
import { Container, Typography, Button, Grid } from "@mui/material";

function errorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Container
      maxWidth="xs"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        mt: 20,
      }}
    >
      <Typography
        variant="h5"
        mb={3}
        sx={{ textTransform: "uppercase", textAlign: "center" }}
      >
        Something went wrong
      </Typography>
      <Grid item xs={12}>
        <Typography variant="h5" mb={3}>
          {error?.message}
        </Typography>
        <Button
          disableElevation
          fullWidth
          size="large"
          variant="contained"
          onClick={resetErrorBoundary}
        >
          Try again
        </Button>
      </Grid>
    </Container>
  );
}

export const ErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <ReactErrorBoundary FallbackComponent={errorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};
