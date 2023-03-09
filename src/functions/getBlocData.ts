import * as vscode from "vscode";
import { BlocDataModel } from "../models/blocIDataModel";

export function getBlocData(): BlocDataModel | undefined {
  if (vscode.window.activeTextEditor?.document.languageId != "dart") {
    return undefined;
  }

  try {
    //^ Editor text
    const content = vscode.window.activeTextEditor?.document.getText();
    if (content == undefined) {
      return undefined;
    }

    //^ Getting bloc data
    const matchData = content.matchAll(new RegExp(/\.*class\s+(\w+).*\s+extends\s+Bloc<(\w+),\s(\w+)/, "gm"));
    const matchDataValue = matchData.next().value;

    if (matchDataValue != undefined && matchDataValue.length >= 4) {
      //^ Getting bloc parts
      const matchParts = content.match(new RegExp(/(?<=\spart\s\')(\w.*)(?=\'\;)/, "gm"));

      if (matchParts != undefined && matchParts.length > 0) {
        //^ Getting bloc events
        const matchBlocEvents = content.match(new RegExp(/\.*(?<=on\<)(\w+)(\>\()(.*)(?=\)\;)/, "gm"));
        const blocEvents = Object();
        if (matchBlocEvents != undefined && matchBlocEvents.length > 0) {
          for (const e in matchBlocEvents) {
            const eventSplitted = matchBlocEvents[e].split(">(");

            if (eventSplitted != undefined && eventSplitted.length == 2) {
              blocEvents[eventSplitted[0]] = eventSplitted[1];
            }
          }
        }

        //& Creating blocDataModel
        const blocData: BlocDataModel = { bloc: matchDataValue[1], event: matchDataValue[2], state: matchDataValue[3], parts: matchParts, events: blocEvents };
        return blocData;
      }
    }
  } catch (error) {
    return undefined;
  }
  return undefined;
}
