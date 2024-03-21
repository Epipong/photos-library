import * as fs from "node:fs";
import path from "path";

const SOURCE_PATH = "../../davy/Pictures/Sony";
const listFiles = fs.readdirSync(path.resolve(__dirname, SOURCE_PATH));

for (const files of listFiles) {
  console.log(files);
}

console.log(process.platform);
