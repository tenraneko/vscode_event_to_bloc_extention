import * as vscode from "vscode";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("generate-bloc-from-events.generate", async () => {
    const eventFilePath = vscode.window.activeTextEditor?.document.fileName;

    //* Wrong file selected
    if (!eventFilePath || (eventFilePath!.indexOf("_event.dart") < 0 && eventFilePath!.indexOf("_events.dart") < 0)) {
      vscode.window.showInformationMessage("Error! Wrong file.");
      return;
    }

    //* Bloc file exists
    const blocFilePath = eventFilePath?.replace(/_event.dart|_events.dart/, "_bloc.dart");
    if (!blocFilePath) {
      vscode.window.showInformationMessage("Couldn't find sing up to the right files");
      return;
    }

    var blocTextCode: string = await fs.readFileSync(blocFilePath, "utf-8");
    if (!blocTextCode) {
      return;
    }

    //* Events text code
    const eventsTextCode = vscode.window.activeTextEditor?.document.getText();
    const mainEventName = eventsTextCode?.match(/abstract class (\w*)/)?.at(1);
    const mainStateName = blocTextCode?.match(/extends Bloc\<\w+,\s(\w+)/)?.at(1);

    if (mainEventName) {
      const events = eventsTextCode?.match(/(?<=^\sclass )[^&]\w*/gm);

      if (events) {
        const blocEvents = blocTextCode!.replace(/(?<=\son<)[^&].*(?=>\(\w*\)\;)/gm, "");
        const blocCodeLines = blocTextCode.split("\n");
        let startFounded = false;
        let endBlocIndex;
        let endFileIndex;

        for (let index = blocCodeLines.length - 1; index > 0; index--) {
          const line = blocCodeLines[index];
          if (line?.trim() == "}") {
            endFileIndex = index + 1;
            break;
          }
        }

        for (let i = 0; i < blocCodeLines.length; i++) {
          const e = blocCodeLines[i];
          if (startFounded == false) {
            if (e.match(/\.*class\s.*extends\s*Bloc\<\w*,\s\w*\>\s*{/)) {
              startFounded = true;
            }
          } else {
            if (e?.trim() == "}") {
              endBlocIndex = i;
              break;
            }
          }
        }

        if (endBlocIndex && endFileIndex) {
          endFileIndex--;
          for (let index = 0; index < events.length; index++) {
            const event = events[index];
            if (blocEvents?.includes(event) == false) {
              const functionName = `_${event[0].toLowerCase()}${event.slice(1)}`;
              blocCodeLines.splice(endBlocIndex, 0, `\t\ton<${event}>(${functionName});`);
              endFileIndex++;
              blocCodeLines.splice(endFileIndex, 0, `\n\tFuture<void> ${functionName}(${event} event, Emitter<${mainStateName}> emit) async {}`);
              endFileIndex++;
              endBlocIndex++;
            }
          }
          fs.writeFileSync(blocFilePath, blocCodeLines.join("\n"));
        }
      }
    }
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}
