import { ImagingEdgeMobile } from "./imaging-edge-mobile";

describe("Imaging Edge Mobile", () => {
  it("should set a default target and source path for linux platform", () => {
    const iem = new ImagingEdgeMobile({ platform: "linux" });

    expect(iem.sourcePath).toEqual("/mnt/e");
    expect(iem.targetPath).toContain("Pictures/Sony");
  });

  it("should set a default target and source path for android platform", () => {
    const iem = new ImagingEdgeMobile({ platform: "android" });

    expect(iem.sourcePath).toEqual("/storage/0000-0000");
    expect(iem.targetPath).toContain("storage/pictures/sony");
  });

  it("should init the right source", () => {
    const iem = new ImagingEdgeMobile({ source: "/home" });

    expect(iem.sourcePath).toEqual("/home");
  });

  it("should init the right target", () => {
    const iem = new ImagingEdgeMobile({ target: "/home" });

    expect(iem.targetPath).toEqual("/home");
  });
});
