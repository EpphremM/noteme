import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const provider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("noteme.openview", provider)
  );


  vscode.window.onDidChangeActiveTextEditor(() => provider.updateComments());

  
  vscode.commands.registerCommand("extension.refreshComments", () => provider.updateComments());

  provider.updateComments(); 
}

export function deactivate() {}
