/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { isFrontendAuthorizationClient } from "@bentley/frontend-authorization-client";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { StageUsage } from "@bentley/ui-abstract";
import { FillCentered } from "@bentley/ui-core";
import {
  BackstageAppButton,
  ConfigurableCreateInfo,
  ContentControl,
  ContentGroup,
  ContentLayoutDef,
  CoreTools,
  Frontstage,
  FrontstageManager,
  FrontstageProps,
  FrontstageProvider,
  ToolWidgetComposer,
  Widget,
  Zone,
} from "@bentley/ui-framework";
import { Button } from "@itwin/itwinui-react";
import * as React from "react";

class SignInControl extends ContentControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    const client = IModelApp.authorizationClient;
    if (isFrontendAuthorizationClient(client)) {
      this.reactNode = (
        <>
          {/* <Button onClick={this._onWorkOffline} />
          <Button onClick={this._onRegister} /> */}
          <FillCentered>
            <Button
              size={"large"}
              styleType={"cta"}
              onClick={async () => {
                await client.signIn(new ClientRequestContext());
              }}
            >
              {"Sign in"}
            </Button>
          </FillCentered>
        </>
      );
    } else {
      this.reactNode = null;
    }
  }

  // user chose to work offline from the sign in page
  private _onWorkOffline = async () => {
    const frontstageDef =
      FrontstageManager.findFrontstageDef("SnapshotSelector");
    await FrontstageManager.setActiveFrontstageDef(frontstageDef);
  };

  private _onRegister = () => {
    window.open("https://developer.bentley.com/register/", "_blank");
  };
}

export class SignInFrontstage extends FrontstageProvider {
  // Content layout for content views
  private _contentLayoutDef: ContentLayoutDef;

  constructor() {
    super();

    // Create the content layouts.
    this._contentLayoutDef = new ContentLayoutDef({});
  }

  public get frontstage(): React.ReactElement<FrontstageProps> {
    const contentGroup: ContentGroup = new ContentGroup({
      contents: [
        {
          classId: SignInControl,
        },
      ],
    });

    return (
      <Frontstage
        id="SignIn"
        defaultTool={CoreTools.selectElementCommand}
        defaultLayout={this._contentLayoutDef}
        contentGroup={contentGroup}
        isInFooterMode={false}
        usage={StageUsage.Private}
        contentManipulationTools={
          <Zone
            widgets={[
              <Widget
                key={"SignInFronstageBackstageButton"}
                isFreeform={true}
                element={
                  <ToolWidgetComposer cornerItem={<BackstageAppButton />} />
                }
              />,
            ]}
          />
        }
      />
    );
  }
}
