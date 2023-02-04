import { render, screen } from "@testing-library/react";
import App from "./App";

const appContent = "Сосчитать еще одного";

// global.fetch = jest.fn(() =>
//   Promise.resolve({ json: () => Promise.resolve("hey") }),
// );

test("Example test", async () => {
  render(<App />);
  expect(screen.getByText(appContent)).toBeDefined();
});
