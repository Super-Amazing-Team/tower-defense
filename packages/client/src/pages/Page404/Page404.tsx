import { ErrorPage } from "@/pages/ErrorPage";
import { ErrorType } from "@/pages/ErrorPage/ErrorPage";

export function Page404() {
  return <ErrorPage error={ErrorType.ERROR_NOT_FOUND} />;
}
