import * as fs from "fs";

export class FileUtils {
  static readFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  static removeLineFromFile(filePath: string, lineToRemove: number) {
    const document = fs.readFileSync(filePath, "utf-8");
    const lines = document.split("\n");

    if (lineToRemove >= 0 && lineToRemove < lines.length) {
      lines.splice(lineToRemove, 1);
      fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
    }
  }
}
