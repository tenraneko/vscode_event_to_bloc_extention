import * as vscode from "vscode";
import { BlocConstructorModel } from "../models/blocConstructorModel";

export function getEndOfBlocConstructor(bloc: string): BlocConstructorModel {
  const lines = vscode.window.activeTextEditor?.document.getText().split("\n");

  let hasConstructor: boolean = false;

  let startIndex: number | undefined = undefined;
  let index: number | undefined = undefined;

  if (lines != undefined && lines.length > 0) {
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim().replace("\n", "");

      if (startIndex == undefined && line.includes(`${bloc}(`)) {
        startIndex = i;

        if ((line.includes("{") && line.includes("}") == false) || (line.includes("{") == false && line.includes(";") == false)) {
          hasConstructor = true;
        }
      } else if (startIndex != undefined && line.includes(`}`)) {
        index = i;
        break;
      }
    }
  }

  return { hasConstructor: hasConstructor, startIndex: startIndex, endIndex: index };
}
