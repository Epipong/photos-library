import { ImagingEdgeMobile } from "../entities/imagingEdgeMobile";
import fs from "fs";
import path from "path";
import cliProgress from "cli-progress";
import { logger } from "../infrastructures/logger";

type extension = "JPG" | "ARW" | "MP4";

class ImagingEdgeSrvc {
  constructor(private iem: ImagingEdgeMobile) {}

  private getYearMonthdayFormat(date: Date) {
    const dateString = date.toISOString();
    return dateString.substring(0, dateString.indexOf("T"));
  }

  private getFileName(file: string) {
    return file.split("/").pop() || "";
  }

  private createFolder(folder: string): string {
    const fullTargetPath = path.resolve(this.iem.targetPath, folder);
    if (!fs.existsSync(fullTargetPath)) {
      fs.mkdirSync(fullTargetPath, { recursive: true });
    }
    return fullTargetPath;
  }

  private copyFile(source: string, target: string, file: string) {
    const targetFilePath = path.resolve(target, this.getFileName(file));
    if (!fs.existsSync(targetFilePath)) {
      fs.copyFileSync(source, targetFilePath);
    }
  }

  public importFilesByExt({ folder, ext }: { folder: string; ext: extension }) {
    const dir = path.resolve(this.iem.sourcePath, folder);
    const files = fs
      .readdirSync(dir, {
        recursive: true,
      })
      .filter((file) => (file as string).endsWith(`.${ext}`));
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);
    bar.start(files.length, 0);
    for (const file of files as string[]) {
      const filePath = path.resolve(dir, file);
      const { birthtime } = fs.statSync(filePath);
      const dateFmt = this.getYearMonthdayFormat(birthtime);
      const targetFolder = this.createFolder(`${dateFmt}/${ext}`);
      this.copyFile(filePath, targetFolder, file);
      bar.increment();
    }
    bar.stop();
  }

  public importFiles() {
    logger.info(
      `import files from '${this.iem.sourcePath}' to the target '${this.iem.targetPath}'.`,
    );
    this.importFilesByExt({ folder: "DCIM", ext: "JPG" });
    this.importFilesByExt({ folder: "DCIM", ext: "ARW" });
    this.importFilesByExt({ folder: "PRIVATE/M4ROOT", ext: "ARW" });
  }
}

export { ImagingEdgeSrvc };
