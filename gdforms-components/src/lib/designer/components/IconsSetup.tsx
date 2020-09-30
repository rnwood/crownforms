import { registerIcons } from "@uifabric/styling";
import React from "react";

export class IconsSetup {
  static isDone = false;

  static setup(): void {
    if (IconsSetup.isDone) {
      return;
    }

    registerIcons({
      icons: {
      }
    });

    IconsSetup.isDone = true;
  }
}
