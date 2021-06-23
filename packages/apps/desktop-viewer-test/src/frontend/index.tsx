/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./index.scss";

import { Logger, LogLevel } from "@bentley/bentleyjs-core";
import React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { AppLoggerCategory } from "../common/LoggerCategory";
import { ITwinViewerApp } from "./app/ITwinViewerApp";
import { AppComponent } from "./components/AppComponent";

const viewerFrontendMain = async () => {
  console.log("index tsx");
  // Setup logging immediately to pick up any logging during App.startup()
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Warning);
  Logger.setLevel(AppLoggerCategory.Frontend, LogLevel.Info);

  // Start the viewer app
  await ITwinViewerApp.startup();

  // when initialization is complete, render
  ReactDOM.render(
    <Provider store={ITwinViewerApp.store}>
      <AppComponent />
    </Provider>,
    document.getElementById("root")
  );
};

viewerFrontendMain(); // eslint-disable-line @typescript-eslint/no-floating-promises
