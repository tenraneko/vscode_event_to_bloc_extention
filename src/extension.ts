import { privateEncrypt } from "crypto";
import * as vscode from "vscode";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("generate-bloc-from-events.generate", async () => {
    const eventFilePath = vscode.window.activeTextEditor?.document.fileName;

    //* Wrong file selected
    if (eventFilePath && eventFilePath!.indexOf("_event.dart") < 0) {
      vscode.window.showInformationMessage("Error! Wrong file.");
      return;
    }

    //* Bloc file exists
    const blocFilePath = eventFilePath?.replace("_event.dart", "_bloc.dart");
    if (!blocFilePath) {
      vscode.window.showInformationMessage("Couldn't find sing up to the right files");
      return;
    }

    //* Events text code
    const eventsTextCode = vscode.window.activeTextEditor?.document.getText();
    const mainEventName = eventsTextCode?.match(/abstract class (\w*)/)!.at(1);

    if (mainEventName) {
      const events = eventsTextCode?.match(/^class (\w+)/gm)?.map((e) => e.replace("class ", ""));

      if (events) {
        const blocTextCode = await fs.readFileSync(blocFilePath, "utf-8");

        if (blocTextCode) {
          const blocEvents = blocTextCode?.match(/on<\w+>\(\w+\);/gm)?.map((e) => e.replace(/on\<(\w+).*/, "$2"));

          console.log(blocEvents);
        }
      }
    }
  });

  context.subscriptions.push(disposable);
}
export function deactivate() {}
