import * as vscode from "vscode";
import * as fs from "fs";

export function getPartContent(part: string): string | undefined {
  const rootPathArray = vscode.window.activeTextEditor?.document.fileName.split("\\");
  const rootPath = rootPathArray?.slice(0, rootPathArray.length - 1).join("\\");
  const filePath = `${rootPath}\\${part}`;

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    return content;
  }

  return undefined;
}
