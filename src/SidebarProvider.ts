import * as vscode from "vscode";
import { CommentManager } from "./CommentManager";
import { NavigationManager } from "./NavigationManager";
import { getHtmlContent } from "./getHtmlContent";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private commentManager: CommentManager;

  constructor(private readonly _extensionUri: vscode.Uri) {
    this.commentManager = new CommentManager();
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = getHtmlContent();

    webviewView.onDidChangeVisibility(() => this.updateComments());

    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "goToLine") {
        NavigationManager.navigateToLine(message.file, message.line);
      } else if (message.command === "deleteComment") {
        this.commentManager.deleteCommentFromFile(message.file, message.line);
        this.updateComments();
      }
    });

    this.updateComments();

    vscode.workspace.onDidSaveTextDocument(() => this.updateComments());
  }

  async updateComments() {
    if (!this._view) {return;}
    const comments = await this.commentManager.getAllComments();
    this._view.webview.postMessage({ command: "updateComments", comments });
  }
}
