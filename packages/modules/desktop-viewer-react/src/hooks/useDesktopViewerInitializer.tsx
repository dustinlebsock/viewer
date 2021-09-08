/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  getInitializationOptions,
  isEqual,
  useBaseViewerInitializer,
} from "@itwin/viewer-react";
import { useEffect, useMemo, useState } from "react";

import { DesktopInitializer } from "../services/Initializer";
import { DesktopViewerProps } from "../types";

// TODO Kevin cleanup
export const useDesktopViewerInitializer = (options?: DesktopViewerProps) => {
  const [desktopViewerInitOptions, setDesktopViewerInitOptions] =
    useState<DesktopViewerProps>();
  const [desktopViewerInitalized, setDesktopViewerInitalized] = useState(false);
  const baseViewerInitialized = useBaseViewerInitializer(
    options,
    !desktopViewerInitalized
  );

  // only re-initialize when initialize options change
  const initializationOptions = useMemo(
    () => getInitializationOptions(options),
    [options]
  );

  useEffect(() => {
    if (
      !desktopViewerInitOptions ||
      !isEqual(initializationOptions, desktopViewerInitOptions)
    ) {
      //TODO omit imodelid, snapshotPath, etc.?
      setDesktopViewerInitalized(false);
      setDesktopViewerInitOptions(initializationOptions);
      void DesktopInitializer.startDesktopViewer(options).then(() => {
        void DesktopInitializer.initialized.then(() => {
          setDesktopViewerInitalized(true);
        });
      });
    }
  }, [initializationOptions, desktopViewerInitOptions]);

  return baseViewerInitialized && desktopViewerInitalized;
};
