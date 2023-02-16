import { window, CodeAction, CodeActionProvider, CodeActionKind } from "vscode";
import { getSelectedText } from "../utils";

export class BlocCodeActionProvider implements CodeActionProvider {
  public provideCodeActions(): CodeAction[] {
    const editor = window.activeTextEditor;
    if (!editor) {
      return [];
    }

    const selectedText = editor.document.getText(getSelectedText(editor));
    if (selectedText === "") {
      return [];
    }
    return [
      {
        command: "bloc-pika.wrapBlocbuilder",
        title: "Pika: Wrap with BlocBuilder",
      },
      {
        command: "bloc-pika.wrapBloclistener",
        title: "Pika: Wrap with BlocListener",
      },
      {
        command: "bloc-pika.wrapBlocconsumer",
        title: "Pika: Wrap with BlocConsumer",
      },
      {
        command: "bloc-pika.wrapBlocprovider",
        title: "Pika: Wrap with BlocProvider",
      },
      {
        command: "bloc-pika.wrapRepositoryprovider",
        title: "Pika: Wrap with RepositoryProvider",
      },
      {
        command: "bloc-pika.wrapMultiBlocprovider",
        title: "Pika: Wrap with MultiBlocProvider",
      },
      {
        command: "bloc-pika.wrapMultiRepositoryprovider",
        title: "Pika: Wrap with MultiRepositoryProvider",
      },
    ].map((c) => {
      let action = new CodeAction(c.title, CodeActionKind.Refactor);
      action.command = {
        command: c.command,
        title: c.title,
      };
      return action;
    });
  }
}
