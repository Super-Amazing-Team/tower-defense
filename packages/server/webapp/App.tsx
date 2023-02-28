// import React from "react";
// // import { hydrateRoot } from "react-dom/client";
// import { hydrateRoot } from "react-dom/client";
// // import ReactDOMClient from "react-dom/client";
// // import App from "./page/App";
//
// // const container = document.getElementById("root");
// // const root = createRoot(container!);
// function runApp(): void {
//   // const container = document.getElementById("root");
//   if (module.hot) {
//     module.hot.accept();
//     // hydrateRoot(document.getElementById("root"), <div>test 1</div> );
//      // createRoot(container!) if you use TypeScript
//     hydrateRoot(document.getElementById("root")!, <div>test 31111</div>);
//   }
// }
// // hydrateRoot(document.getElementById("root")!, <div>test 3111</div>);
// runApp();

// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from "react-dom/client";
import { Test } from "./test";

// import App from './components/App';

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container as HTMLElement);
root.render(<Test />);
