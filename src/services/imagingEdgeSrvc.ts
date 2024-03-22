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

  private copyFile({
    source,
    target,
    file,
    force,
  }: {
    source: string;
    target: string;
    file: string;
    force?: boolean;
  }) {
    const targetFilePath = path.resolve(target, this.getFileName(file));
    if (force || !fs.existsSync(targetFilePath)) {
      fs.copyFileSync(source, targetFilePath);
    }
  }

  public importFilesByExt({
    folder,
    ext,
    force,
  }: {
    folder: string;
    ext: extension;
    force?: boolean;
  }) {
    const dir = path.resolve(this.iem.sourcePath, folder);
    const files = fs
      .readdirSync(dir, {
        recursive: true,
      })
      .filter((file) => (file as string).endsWith(`.${ext}`));
    const bar = new cliProgress.SingleBar({
      format: ' {bar} | {percentage}% | {filename} | ETA: {eta}s | {value}/{total}'
    }, cliProgress.Presets.shades_grey);
    bar.start(files.length, 0);
    for (const file of files as string[]) {
      const filePath = path.resolve(dir, file);
      const { mtime } = fs.statSync(filePath);
      const dateFmt = this.getYearMonthdayFormat(mtime);
      const targetFolder = this.createFolder(`${dateFmt}/${ext}`);
      this.copyFile({ source: filePath, target: targetFolder, file, force });
      bar.increment({ filename: this.getFileName(file) });
    }
    bar.stop();
  }

  public importFiles(force: boolean = false) {
    logger.info(
      `import files from '${this.iem.sourcePath}' to the target '${this.iem.targetPath}'.`,
    );
    this.importFilesByExt({ folder: "DCIM", ext: "JPG", force: force });
    this.importFilesByExt({ folder: "DCIM", ext: "ARW", force: force });
    this.importFilesByExt({
      folder: "PRIVATE/M4ROOT",
      ext: "MP4",
      force: force,
    });
  }
}

export { ImagingEdgeSrvc };
