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
exports.SidebarProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
class SidebarProvider {
    _extensionUri;
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtmlContent();
        webviewView.onDidChangeVisibility(() => {
            this.updateComments();
        });
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === "goToLine") {
                this.navigateToLine(message.file, message.line);
            }
            else if (message.command === "deleteComment") {
                this.deleteCommentFromFile(message.file, message.line);
            }
        });
        this.updateComments();
        vscode.workspace.onDidSaveTextDocument(() => {
            this.updateComments();
        });
    }
    async updateComments() {
        if (!this._view)
            return;
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders)
            return;
        const comments = [];
        const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
        for (const fileUri of files) {
            this.extractCommentsFromFile(fileUri.fsPath, comments);
        }
        this._view.webview.postMessage({ command: "updateComments", comments });
    }
    extractCommentsFromFile(filePath, comments) {
        try {
            const document = fs.readFileSync(filePath, "utf-8");
            const lines = document.split("\n");
            lines.forEach((line, index) => {
                const match = line.match(/\/\/\.(.*?)$/);
                if (match) {
                    comments.push({ text: match[1].trim(), line: index, file: filePath });
                }
            });
        }
        catch (error) {
            console.error("Error reading file:", filePath, error);
        }
    }
    async navigateToLine(filePath, line) {
        const document = await vscode.workspace.openTextDocument(filePath);
        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(line, 0);
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(new vscode.Range(position, position));
    }
    async deleteCommentFromFile(filePath, lineToRemove) {
        try {
            const document = fs.readFileSync(filePath, "utf-8");
            const lines = document.split("\n");
            if (lineToRemove >= 0 && lineToRemove < lines.length) {
                lines.splice(lineToRemove, 1);
                fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
                this.updateComments();
            }
        }
        catch (error) {
            console.error("Error deleting comment from file:", filePath, error);
        }
    }
    getHtmlContent() {
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Tracked Comments</title>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #1E1E1E; 
            color: white; 
            padding: 10px; 
            margin: 0; 
          }
          h2 { 
            font-size: 1.2em; 
            margin-bottom: 10px; 
          }
          ul { 
            list-style-type: none; 
            padding: 0; 
            margin: 0; 
          }
          li { 
            padding: 8px; 
            margin: 4px 0; 
            background: #2D2D30; 
            cursor: pointer; 
            border-radius: 4px; 
            position: relative; 
            display: flex; 
            
            justify-content: space-between; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
          }
          li:hover { 
            background: #3C3C3C; 
          }
          li strong { 
            font-size: 0.9em; 
            overflow: hidden; 
            text-overflow: ellipsis; 
          }
          li span { 
            font-size: 0.75em; 
            color: #aaa; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            max-width: 80%; 
          }
  
          /* Delete button */
          .delete-btn {
            font-family: "Material Symbols Outlined";
            font-size: 1.6em;
            color: #ff5555;
            cursor: pointer;
            padding: 4px;
          }
          .delete-btn:hover { 
            color: #ff2222; 
          }
  .cont{
 
  }
          .tooltip {
          width:100%;  
          position:absolute; 
           margin-top:5px;   
            visibility: hidden;
            direction: rtl; 
            text-align: left; RTL container */
   
            overflow: hidden;
            text-overflow: ellipsis;
          }
          li:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
  
      
          .file-path {
            direction: rtl; 
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            
            max-width: 80%; /* Limit width to allow ellipsis */
          }

         
          
         li:hover .file-path{
         display: none;
         }
        </style>
      </head>
      <body>
        <h2>Tracked Comments</h2>
        <ul id="commentList"></ul>
        <script>
          const vscode = acquireVsCodeApi();
  
          function getFileName(filePath) {
            return filePath.split(/[\\\\/]/).pop(); // Extract file name from path
          }
  
          function truncateFilePath(filePath) {
            if (filePath.length > 40) {
              return "..." + filePath.slice(-40); // Truncate from the front
            }
            return filePath;
          }
  
          function updateCommentList(comments) {
            const commentList = document.getElementById("commentList");
            if (!commentList) return;
            commentList.innerHTML = "";
  
            comments.forEach(({ text, line, file }) => {
              const li = document.createElement("li");
              li.innerHTML = \`
                <div class="cont">
                <strong>\${text}</strong><br>
                <span class="file-path">\${getFileName(file)} (Line \${line + 1})</span>
                  <span class="tooltip">\${file}</span>
                </div>
                <span class="delete-btn" onclick="deleteComment('\${file}', \${line})">remove</span>
              \`;
  
              li.onclick = () => vscode.postMessage({ command: "goToLine", file, line });
              commentList.appendChild(li);
            });
          }
  
          function deleteComment(file, line) {
            vscode.postMessage({ command: "deleteComment", file, line });
          }
  
          window.addEventListener("message", (event) => {
            const { command, comments } = event.data;
            if (command === "updateComments") {
              updateCommentList(comments);
            }
          });
        </script>
      </body>
      </html>`;
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=noteme.js.map