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
const CommentManager_1 = require("./CommentManager");
const NavigationManager_1 = require("./NavigationManager");
const getHtmlContent_1 = require("./getHtmlContent");
class SidebarProvider {
    _extensionUri;
    _view;
    commentManager;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        this.commentManager = new CommentManager_1.CommentManager();
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = (0, getHtmlContent_1.getHtmlContent)();
        webviewView.onDidChangeVisibility(() => this.updateComments());
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === "goToLine") {
                NavigationManager_1.NavigationManager.navigateToLine(message.file, message.line);
            }
            else if (message.command === "deleteComment") {
                this.commentManager.deleteCommentFromFile(message.file, message.line);
                this.updateComments();
            }
        });
        this.updateComments();
        vscode.workspace.onDidSaveTextDocument(() => this.updateComments());
    }
    async updateComments() {
        if (!this._view)
            return;
        const comments = await this.commentManager.getAllComments();
        this._view.webview.postMessage({ command: "updateComments", comments });
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=SidebarProvider.js.map