import { Link } from "react-router-dom";

export function Page500() {
  return (
    <div id="error-page">
      <h1>I&apos;m Page500 Component</h1>
      <Link to="/">Go home</Link>
    </div>
  );
}
