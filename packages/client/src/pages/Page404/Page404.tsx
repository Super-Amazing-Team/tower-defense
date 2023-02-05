import { Link } from "react-router-dom";

export function Page404() {
  return (
    <div id="error-page">
      <h1>I&apos;m Page404 Component</h1>
      <Link to="/">Go home</Link>
    </div>
  );
}
