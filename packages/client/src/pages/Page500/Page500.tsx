import { ErrorPage } from "@/pages/ErrorPage";
import { ErrorType } from "@/pages/ErrorPage/ErrorPage";

export function Page500() {
  return <ErrorPage error={ErrorType.SERVER_ERROR} />;
}
