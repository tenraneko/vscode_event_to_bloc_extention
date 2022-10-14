"use strict";

import * as vscode from "vscode";

export function getFileContext(blocRelativePath: string) {
  const blocIsOpen = pubspecFileIsOpen(blocRelativePath);
  const blocPath = blocIsOpen ? vscode.window.activeTextEditor!.document.uri.fsPath : `${vscode.workspace.rootPath}/${blocRelativePath}`;

  return {
    openInEditor: blocIsOpen,
    path: blocPath,
  };
}

function pubspecFileIsOpen(blocRelativePath: string) {
  return vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.fileName.endsWith(blocRelativePath.split("\\").at(-1)!);
}
