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

    const listOfEventsFromParts = getEventsFromParts(blocData.parts, blocData.event);

    const blocConstructor = getEndOfBlocConstructor(blocData.bloc);
    let endIndex = getEndOfFile();

    if (endIndex == undefined || blocConstructor.endIndex == undefined) return;

    const newLinesBloc = [];
    const newLines = [];

    if (listOfEventsFromParts != undefined) {
      for (const key in listOfEventsFromParts) {
        const eventsList = listOfEventsFromParts[key];

        //: TODO add sort for functions
        // newLinesBloc.push(`\t\t//& ${key}`);
        for (let r = 0; r < eventsList.length; r++) {
          const event = eventsList[r];

          if (blocData.events.hasOwnProperty(event) == false) {
            const functionName = `_${event[0].toLowerCase()}${event.slice(1)}`;

            newLinesBloc.push(`\t\t\ton<${event}>(${functionName});`);
            newLines.push(`\n\t\/\/\* ${event}\n\tFuture<void> ${functionName}(${event} event, Emitter<${blocData.state}> emit) async {}`);
          }
        }
      }
    }

    const lines = vscode.window.activeTextEditor?.document.getText().split("\n");

    if (blocConstructor.hasConstructor == false) {
      let test = lines![blocConstructor.startIndex!];
      lines![blocConstructor.startIndex!] = lines![blocConstructor.startIndex!].replace(/\{\.*\}|\;/, "{");

      // lines?.splice(blocConstructor.startIndex! + 1, 0, "{");
      lines?.splice(blocConstructor.startIndex! + 1, 0, "\t}");

      blocConstructor.endIndex = blocConstructor.endIndex! - 5;
      endIndex = endIndex + 2;
    }

    lines?.splice(endIndex, 0, newLines.join("\n\r"));
    lines?.splice(blocConstructor.endIndex!, 0, newLinesBloc.join("\n"));

    fs.writeFileSync(vscode.window.activeTextEditor!.document.fileName, lines!.join("\n"), "utf-8");

    return true;
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}
