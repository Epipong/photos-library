import { ImagingEdgeMobile } from "../sony/entities/imaging-edge-mobile";

const iemImport = new ImagingEdgeMobile({
  source: "./src/test/source",
  target: "./src/test/target",
});

const iemExport = new ImagingEdgeMobile({
  source: "./src/test/target",
  target: "./src/test/ssd",
});

export { iemImport, iemExport };
