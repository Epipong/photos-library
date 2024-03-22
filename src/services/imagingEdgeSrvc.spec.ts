import { ImagingEdgeMobile } from "../entities/imagingEdgeMobile";
import { iem } from "../fixtures/iem";
import { ImagingEdgeSrvc } from "./imagingEdgeSrvc";

describe("ImagingEdgeCtrl", () => {
  describe("Import Files", () => {
    it("should", () => {
      const manager = new ImagingEdgeSrvc(iem);

      manager.importFilesByExt({ folder: "DCIM", ext: "JPG" });
      expect(true).toBeTruthy();
    });
  });
});
