import { config } from "../settings/config";

class ImagingEdgeMobile {
  private readonly sourcePathByOs: Map<NodeJS.Platform, string> = new Map([
    ["android", config.sourcePathAndroid],
    ["linux", config.sourcePathLinux],
    ["darwin", config.sourcePathMacOs],
  ]);

  private readonly targetPathByOs: Map<NodeJS.Platform, string> = new Map([
    ["android", config.targetPathAndroid],
    ["linux", config.targetPathLinux],
    ["darwin", config.targetPathMacOs],
  ]);

  public sourcePath: string;
  public targetPath: string;

  /**
   * Imaging Edge Mobile class.
   * @param source relative path to the source folder.
   * @param target relative path to the target folder.
   * @param platform
   */
  constructor({
    source,
    target,
    platform = process.platform,
  }: {
    source?: string;
    target?: string;
    platform?: NodeJS.Platform;
  }) {
    this.sourcePath = source || this.sourcePathByOs.get(platform) || "";
    this.targetPath = target || this.targetPathByOs.get(platform) || "";
  }
}

export { ImagingEdgeMobile };
