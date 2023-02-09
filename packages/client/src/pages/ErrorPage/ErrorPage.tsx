import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import { Error404, Error500 } from "../../utils/icons";

export interface IErrorPageProps {
  error: ErrorType;
}

export enum ErrorType {
  ERROR_NOT_FOUND,
  SERVER_ERROR,
}

export function ErrorPage(props: IErrorPageProps) {
  const navigate = useNavigate();
  const errorNotFoundTitle: string = "SORRY, PAGE NOT FOUND";
  const errorServerErrorTitle: string = "INTERNAL SERVER ERROR";

  function handleButtonBack() {
    navigate(-1);
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <p>An unexpected error has occurred</p>
        {props.error === ErrorType.ERROR_NOT_FOUND ? (
          <Error404 />
        ) : (
          <Error500 />
        )}
      </Box>
      <Typography mb={5}>
        {props.error === ErrorType.ERROR_NOT_FOUND
          ? errorNotFoundTitle
          : errorServerErrorTitle}
      </Typography>
      <Button
        component="label"
        size="small"
        variant="contained"
        color="primary"
        onClick={handleButtonBack}
      >
        Back
      </Button>
      <Box>
        <div className="error-image" />
        {/* как-то прописать диву background-image */}
      </Box>
    </Container>
  );
}
