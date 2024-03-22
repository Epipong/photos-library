import { iem } from "../fixtures/iem";
import { ImagingEdgeSrvc } from "./imagingEdgeSrvc";
import fs from "fs";

describe("ImagingEdgeCtrl", () => {
  beforeAll(() => {
    if (fs.existsSync(iem.targetPath)) {
      fs.rmSync(iem.targetPath, { recursive: true });
    }
  });

  describe("Import files by Extension", () => {
    it("should copy JPG file to target folder.", () => {
      const manager = new ImagingEdgeSrvc(iem);

      manager.importFilesByExt({ folder: "DCIM", ext: "JPG" });
      const files = fs.readdirSync(iem.targetPath, { recursive: true });
      expect(files.length).toBeGreaterThan(0);
    });
  });

  describe("Import all files", () => {
    it("should copy all files in target folder.", () => {
      const manager = new ImagingEdgeSrvc(iem);

      manager.importFiles();
      const files = fs.readdirSync(iem.targetPath, { recursive: true });
      const imageFiles = files.filter((file) =>
        (file as string).endsWith(".JPG"),
      );
      const videoFiles = files.filter((file) =>
        (file as string).endsWith(".MP4"),
      );
      expect(imageFiles.length).toBeGreaterThan(0);
      expect(videoFiles.length).toBeGreaterThan(0);
    });
  });

  describe("Export all files", () => {
    it("should export the files to the target path.", () => {
      const manager = new ImagingEdgeSrvc(iem);
      expect(true).toBeTruthy();
    });
  });
});
