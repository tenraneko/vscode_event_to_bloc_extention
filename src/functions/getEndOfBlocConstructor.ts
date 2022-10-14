import * as vscode from "vscode";

export function getEndOfBlocConstructor(bloc: string): number | undefined {
  const lines = vscode.window.activeTextEditor?.document.getText().split("\r");

  let startFounded: boolean = false;

  let index: number | undefined = undefined;

  if (lines != undefined && lines.length > 0) {
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim().replace("\n", "");

      if (startFounded == false && line.includes(`${bloc}({`)) {
        startFounded = true;
      } else if (startFounded == true && line.includes(`}`)) {
        index = i;
        break;
      }
    }
  }

  return index;
}
