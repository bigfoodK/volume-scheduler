import React from "react";
import * as ReactDOMClient from "react-dom/client";
import App from "./component/App";
import { RecoilRoot } from "recoil";

const container = document.getElementById("app")!;
const root = ReactDOMClient.createRoot(container);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
