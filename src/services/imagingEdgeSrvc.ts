import { ImagingEdgeMobile } from "../entities/imagingEdgeMobile";
import { logger } from "../infrastructures/logger";
import fs from "fs";
import path from "path";

type extension = "JPG" | "ARW" | "MP4";

class ImagingEdgeSrvc {
  constructor(private iem: ImagingEdgeMobile) {}

  public importFilesByExt({ folder, ext }: { folder: string; ext: extension }) {
    const files = fs
      .readdirSync(path.resolve(this.iem.sourcePath, folder), {
        recursive: true,
      })
      .filter((file) => (file as string).endsWith(`.${ext}`));
    logger.info(files);
  }

  public importFiles() {
    logger.info(
      `import files from '${this.iem.sourcePath}' to the target '${this.iem.targetPath}'.`,
    );
    const files = fs.readdirSync(this.iem.sourcePath);

    for (const file of files) {
      logger.info(path.resolve(this.iem.sourcePath, file));
    }
  }
}

export { ImagingEdgeSrvc };
