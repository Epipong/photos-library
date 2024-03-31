import { logger } from "../../infrastructures/logger";
import { config } from "../../settings/config";
import { ImagingEdgeMobile } from "./imaging-edge-mobile";

const originalEnv = process.env;
describe("Imaging Edge Mobile", () => {
  beforeAll(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      SOURCE_PATH_LINUX: "/mnt/e",
      SOURCE_PATH_ANDROID: "/storage/0000-0000",
      SOURCE_PATH_MACOS: "/Users/john/Pictures",
      TARGET_PATH_LINUX: "/home/user/Pictures/Sony",
      TARGET_PATH_ANDROID: "/home/user/storage/pictures/sony",
      TARGET_PATH_MACOS: "/Volumes/Untitled/Pictures",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should set a default target and source path for linux platform", () => {
    const iem = new ImagingEdgeMobile({
      source: process.env.SOURCE_PATH_LINUX,
      target: process.env.TARGET_PATH_LINUX,
      platform: "linux",
    });

    expect(iem.sourcePath).toEqual("/mnt/e");
    expect(iem.targetPath).toContain("Pictures/Sony");
  });

  it("should set a default target and source path for android platform", () => {
    const iem = new ImagingEdgeMobile({
      source: process.env.SOURCE_PATH_ANDROID,
      target: process.env.TARGET_PATH_ANDROID,
      platform: "android",
    });

    expect(iem.sourcePath).toEqual("/storage/0000-0000");
    expect(iem.targetPath).toContain("storage/pictures/sony");
  });

  it("should set a default target and source path for darwin platform", () => {
    const iem = new ImagingEdgeMobile({
      source: process.env.SOURCE_PATH_MACOS,
      target: process.env.TARGET_PATH_MACOS,
      platform: "darwin",
    });

    expect(iem.sourcePath).toEqual("/Users/john/Pictures");
    expect(iem.targetPath).toEqual("/Volumes/Untitled/Pictures");
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
