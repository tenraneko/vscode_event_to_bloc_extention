import * as vscode from "vscode";

export function getEndOfFile(): number | undefined {
  const lines = vscode.window.activeTextEditor?.document.getText().split("\n");

  let index: number | undefined = undefined;

  if (lines != undefined && lines.length > 0) {
    for (let i = lines.length - 1; i > 0; i--) {
      const line = lines[i].trim().replace("\n", "");

      if (index == undefined && line == "}") {
        index = i;
        break;
      }
    }
  }

  return index;
}
