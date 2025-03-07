"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
// The main function that gets called when the extension is activated.
function activate(context) {
    const provider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("vscodeSidebar.openview", provider));
    // Update comments in real time when files change
    vscode.workspace.onDidChangeTextDocument(() => provider.updateComments());
    vscode.workspace.onDidOpenTextDocument(() => provider.updateComments());
    vscode.workspace.onDidChangeWorkspaceFolders(() => provider.updateComments());
    provider.updateComments(); // Initial load
}
function deactivate() { }
class SidebarProvider {
    _extensionUri;
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    // Resolve the webview and set its content.
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtmlContent();
        this.updateComments();
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === "goToLine") {
                this.navigateToLine(message.line, message.file);
            }
        });
    }
    // Scan all project files for comments
    async updateComments() {
        if (!this._view)
            return;
        const matches = [];
        // Find all files with supported extensions
        const files = await vscode.workspace.findFiles("**/*.{ts,js,tsx,jsx,py,java,cpp,cs,go}", "**/node_modules/**");
        for (const file of files) {
            const document = await vscode.workspace.openTextDocument(file);
            matches.push(...this.extractCommentsFromDocument(document));
        }
        this._view.webview.postMessage({ command: "updateComments", comments: matches });
    }
    // Extract comments starting with /// from a document
    extractCommentsFromDocument(document) {
        const matches = [];
        const filePath = document.uri.fsPath;
        for (let i = 0; i < document.lineCount; i++) {
            const lineText = document.lineAt(i).text.trim();
            if (lineText.startsWith("///")) {
                const cleanText = lineText.replace("///", "").trim();
                matches.push({ text: cleanText, line: i, file: filePath });
            }
        }
        return matches;
    }
    // Navigate to a specific line in the specified file
    async navigateToLine(line, file) {
        const document = await vscode.workspace.openTextDocument(file);
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(line, 0);
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(new vscode.Range(position, position));
    }
    // HTML content for the sidebar webview
    getHtmlContent() {
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tracked Comments</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 10px; background-color: #1E1E1E; color: white; }
          h2 { font-size: 1.5em; margin-bottom: 10px; }
          ul { list-style-type: none; padding-left: 0; }
          li { padding: 8px; margin: 4px 0; background-color: #2D2D30; cursor: pointer; border-radius: 4px; }
          li:hover { background-color: #3C3C3C; }
          li span { font-size: 0.9em; color: #888; display: block; }
          li:hover span { color: #fff; }
          li { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
        </style>
      </head>
      <body>
        <h2>Tracked Comments</h2>
        <ul id="commentList"></ul>
        <script>
          const vscode = acquireVsCodeApi();

          // Listen for messages from the extension
          window.addEventListener("message", (event) => {
            const { command, comments } = event.data;
            if (command === "updateComments") {
              updateCommentList(comments);
            }
          });

          // Update the comment list in the sidebar
          function updateCommentList(comments) {
            const commentList = document.getElementById("commentList");
            if (!commentList) return;
            commentList.innerHTML = "";

            comments.forEach(({ text, line, file }) => {
              const li = document.createElement("li");
              const truncatedText = text.length > 40 ? text.substring(0, 40) + "..." : text;
              const filePath = file.replace(/^.*[\\\/]/, ''); // Show only the filename

              li.innerHTML = \`<strong>\${truncatedText}</strong><br><span>\${filePath} (Line \${line + 1})</span>\`;

              li.onclick = () => vscode.postMessage({ command: "goToLine", line, file });
              commentList.appendChild(li);
            });
          }
        </script>
      </body>
      </html>`;
    }
}
//# sourceMappingURL=global.js.map