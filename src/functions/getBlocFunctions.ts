import * as vscode from "vscode";

export function getBlocFunctions() {
  const lines = vscode.window.activeTextEditor?.document.getText().split("\r");

  if (lines != undefined && lines.length > 0) {
    let endIndex = undefined;
    for (let i = lines.length - 1; i > 0; i--) {
      const line = lines[i].trim().replace("\n", "");

      if (endIndex == undefined && line == "}") {
        endIndex = i - 1;
      }
    }
    console.log(endIndex);
  }

  //   console.log(lines);
}
