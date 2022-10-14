import * as vscode from "vscode";
import * as fs from "fs";
import { getBlocData } from "./functions/getBlocData";
import { BlocDataModel } from "./models/blocIDataModel";
import { getEventsFromParts } from "./functions/getEventsFromParts";
import { getEndOfFile } from "./functions/getEndOfFile";
import { getEndOfBlocConstructor } from "./functions/getEndOfBlocConstructor";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("generate-bloc-from-events.generate", async () => {
    const blocData: BlocDataModel | undefined = getBlocData();

    if (blocData == undefined) {
      vscode.window.showErrorMessage("Error! Wrong file selected. Open Bloc file in editor.");
      return;
    }

    const listOfEventsFromParts: string[] | undefined = getEventsFromParts(blocData.parts, blocData.event);

    const endBlocIndex = getEndOfBlocConstructor(blocData.bloc);
    const endIndex = getEndOfFile();

    if (endIndex == undefined || endBlocIndex == undefined) return;

    const newLinesBloc = [];
    const newLines = [];

    if (listOfEventsFromParts != undefined && listOfEventsFromParts.length > 0) {
      for (let index = 0; index < listOfEventsFromParts.length; index++) {
        const event = listOfEventsFromParts[index];

        if (blocData.events.hasOwnProperty(event) == false) {
          const functionName = `_${event[0].toLowerCase()}${event.slice(1)}`;

          newLinesBloc.push(`\t\ton<${event}>(${functionName});`);
          newLines.push(`\n\t\/\/\* ${event}\n\tFuture<void> ${functionName}(${event} event, Emitter<${blocData.state}> emit) async {}`);
        }
      }
    }

    const lines = vscode.window.activeTextEditor?.document.getText().split("\n");
    lines?.splice(endIndex, 0, newLines.join("\n\r"));
    lines?.splice(endBlocIndex, 0, newLinesBloc.join("\n"));

    fs.writeFileSync(vscode.window.activeTextEditor!.document.fileName, lines!.join("\n"), "utf-8");

    return true;
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}
