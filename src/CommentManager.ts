import * as vscode from "vscode";
import * as fs from "fs";
import { FileUtils } from "./FileUtils";

export class CommentManager {
  async getAllComments() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {return [];}

    const comments: { text: string; line: number; file: string }[] = [];
    const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");

    for (const fileUri of files) {
      this.extractCommentsFromFile(fileUri.fsPath, comments);
    }

    return comments;
  }

  private extractCommentsFromFile(filePath: string, comments: { text: string; line: number; file: string }[]) {
    try {
      const document = FileUtils.readFile(filePath);
      const lines = document.split("\n");

      lines.forEach((line:any, index:any) => {
        const match = line.match(/\/\/~(.*?)$/);
        if (match) {
          comments.push({ text: match[1].trim(), line: index, file: filePath });
        }
      });
    } catch (error) {
      console.error("Error reading file:", filePath, error);
    }
  }

  deleteCommentFromFile(filePath: string, lineToRemove: number) {
    try {
      FileUtils.removeLineFromFile(filePath, lineToRemove);
    } catch (error) {
      console.error("Error deleting comment from file:", filePath, error);
    }
  }
}
