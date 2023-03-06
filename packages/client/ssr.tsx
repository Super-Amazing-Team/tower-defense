import { renderToString } from "react-dom/server";
import App from "./src/App";

export function render() {
  return renderToString(<App />);
}
