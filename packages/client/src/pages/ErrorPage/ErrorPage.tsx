import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import errorNotFoundImage from "../../assets/images/404.svg";
import errorServerImage from "../../assets/images/500.svg";
import errorImage from "../../assets/images/image_error.png";

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
        <img
          alt="An unexpected error has occurred"
          src={
            props.error === ErrorType.ERROR_NOT_FOUND
              ? errorNotFoundImage
              : errorServerImage
          }
        />
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
        <img alt="An unexpected error has occurred" src={errorImage} />
      </Box>
    </Container>
  );
}
