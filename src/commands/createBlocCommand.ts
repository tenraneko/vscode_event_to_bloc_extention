import { window, Uri } from "vscode";
import { createBlocFiles } from "../files/createBlocFiles";
import { getBlocClassName, getBlocFilename } from "../utils";

export async function createBlocCommand(folder: Uri | undefined) {
  const blocName = await getBlocNameFromInput();
  if (blocName === undefined) {
    return -1;
  }

  const blocFilename = getBlocFilename(blocName);
  const blocClassname = getBlocClassName(blocName);
  if (blocFilename.length === 0 || blocClassname.length === 0) {
    window.showErrorMessage(`Bloc wasn't created: invalid bloc name`);
    return -2;
  }

  folder = folder || (await getBlocFolder());
  if (folder === undefined) {
    window.showWarningMessage(`Bloc wasn't created: invalid folder`);
    return -3;
  }

  const pathJoins = folder.path.split("/");
  const path = pathJoins.slice(0, -1).join("/");

  createBlocFiles(path + "/bloc", blocFilename, blocClassname);

  window.showInformationMessage(`Bloc ${blocClassname} successfully created`);
  return 0;
}

async function getBlocNameFromInput(): Promise<string | undefined> {
  return window.showInputBox({
    prompt: "Bloc name",
    placeHolder: "Only alpha-numeric characters, spaces and underscore are supported",
  });
}

async function getBlocFolder(): Promise<Uri | undefined> {
  const folders = await window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    openLabel: "Select File",
  });
  return folders !== undefined && folders.length > 0 ? folders[0] : undefined;
}
