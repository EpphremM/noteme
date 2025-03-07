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
exports.CommentManager = void 0;
const vscode = __importStar(require("vscode"));
const FileUtils_1 = require("./FileUtils");
class CommentManager {
    async getAllComments() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return [];
        }
        const comments = [];
        const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
        for (const fileUri of files) {
            this.extractCommentsFromFile(fileUri.fsPath, comments);
        }
        return comments;
    }
    extractCommentsFromFile(filePath, comments) {
        try {
            const document = FileUtils_1.FileUtils.readFile(filePath);
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
    deleteCommentFromFile(filePath, lineToRemove) {
        try {
            FileUtils_1.FileUtils.removeLineFromFile(filePath, lineToRemove);
        }
        catch (error) {
            console.error("Error deleting comment from file:", filePath, error);
        }
    }
}
exports.CommentManager = CommentManager;
//# sourceMappingURL=CommentManager.js.map