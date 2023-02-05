import { useRouteError } from "react-router-dom";

export function Page404() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>I&apos;m Page404 Component</h1>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
