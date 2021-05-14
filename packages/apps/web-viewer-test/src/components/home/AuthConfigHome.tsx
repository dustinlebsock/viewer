/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BrowserAuthorizationClientConfiguration } from "@bentley/frontend-authorization-client";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { ColorTheme } from "@bentley/ui-framework";
import { Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useState } from "react";

import { history } from "../routing";
import { Header } from ".";
import styles from "./Home.module.scss";

/**
 * Test a viewer that uses auth configuration provided at startup
 * @returns
 */
export const AuthConfigHome: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(
    (IModelApp.authorizationClient?.hasSignedIn &&
      IModelApp.authorizationClient?.isAuthorized) ||
      false
  );
  const [iModelId, setIModelId] = useState(
    process.env.IMJS_AUTH_CLIENT_IMODEL_ID
  );
  const [contextId, setContextId] = useState(
    process.env.IMJS_AUTH_CLIENT_CONTEXT_ID
  );

  const authConfig: BrowserAuthorizationClientConfiguration = {
    scope: process.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
    clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
    redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
    postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
    responseType: "code",
  };

  useEffect(() => {
    setLoggedIn(
      IModelApp.authorizationClient
        ? IModelApp.authorizationClient.hasSignedIn &&
            IModelApp.authorizationClient.isAuthorized
        : false
    );
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("contextId")) {
      setContextId(urlParams.get("contextId") as string);
    }

    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    }
  }, []);

  useEffect(() => {
    history.push(`authconfig?contextId=${contextId}&iModelId=${iModelId}`);
  }, [contextId, iModelId]);

  const toggleLogin = async () => {
    if (!loggedIn) {
      await IModelApp.authorizationClient?.signIn();
    } else {
      await IModelApp.authorizationClient?.signOut();
    }
  };

  const onIModelAppInit = () => {
    setLoggedIn(IModelApp.authorizationClient?.isAuthorized ?? false);
    IModelApp.authorizationClient?.onUserStateChanged.addListener(() => {
      setLoggedIn(
        (IModelApp.authorizationClient?.hasSignedIn &&
          IModelApp.authorizationClient?.isAuthorized) ||
          false
      );
    });
  };

  const switchModel = () => {
    if (iModelId === (process.env.IMJS_AUTH_CLIENT_IMODEL_ID as string)) {
      setIModelId(process.env.IMJS_AUTH_CLIENT_IMODEL_ID2 as string);
    } else {
      setIModelId(process.env.IMJS_AUTH_CLIENT_IMODEL_ID as string);
    }
  };

  return (
    <div className={styles.home}>
      <Header
        handleLoginToggle={toggleLogin}
        loggedIn={loggedIn}
        switchModel={switchModel}
      />
      <Viewer
        authConfig={{ config: authConfig }}
        contextId={contextId}
        iModelId={iModelId}
        appInsightsKey={process.env.IMJS_APPLICATION_INSIGHTS_KEY}
        theme={ColorTheme.Dark}
        onIModelAppInit={onIModelAppInit}
      />
    </div>
  );
};
