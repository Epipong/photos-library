import { ImagingEdgeMobile } from "../entities/imagingEdgeMobile";
import { iem } from "../fixtures/iem";
import { ImagingEdgeSrvc } from "./imagingEdgeSrvc";
import fs from "fs";
import path from "path";

describe("ImagingEdgeCtrl", () => {
  beforeAll(() => {
    const target = path.resolve(__dirname, "../test/target");
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true });
    }
  });

  describe("Import files by Extension", () => {
    it("should copy JPG file to target folder.", () => {
      const manager = new ImagingEdgeSrvc(iem);
      const target = path.resolve(__dirname, "../test/target");

      manager.importFilesByExt({ folder: "DCIM", ext: "JPG" });
      const files = fs.readdirSync(target, { recursive: true });
      expect(files.length).toBeGreaterThan(0);
    });
  });

  describe("Import all files", () => {
    it("should copy all files in target folder.", () => {
      const manager = new ImagingEdgeSrvc(iem);
      const target = path.resolve(__dirname, "../test/target");
      
      manager.importFiles();
      const files = fs.readdirSync(target, { recursive: true });
      const imageFiles = files
        .filter((file) => (file as string).endsWith('.JPG'));
      const videoFiles = files
        .filter((file) => (file as string).endsWith('.MP4'));
      expect(imageFiles.length).toBeGreaterThan(0);
      expect(videoFiles.length).toBeGreaterThan(0);
    });
  });
});
