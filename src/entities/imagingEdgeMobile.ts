import path from "path";

class ImagingEdgeMobile {
  private readonly sourcePathByOs: Map<NodeJS.Platform, string> = new Map([
    ["android", "/storage/0000-0000"],
    ["linux", "/mnt/e"],
  ]);

  private readonly targetPathByOs: Map<NodeJS.Platform, string> = new Map([
    ["android", `${path.resolve(__dirname, "../../storage/pictures/sony")}`],
    ["linux", `${path.resolve(__dirname, "../../davy/Pictures/Sony")}`],
  ]);

  private _sourcePath: string = "";
  private _targetPath: string = "";

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
    if (!source && this.sourcePathByOs.has(platform)) {
      this._sourcePath = this.sourcePathByOs.get(platform) || "";
    } else if (source) {
      this.sourcePath = source;
    }

    if (!target && this.targetPathByOs.has(platform)) {
      this._targetPath = this.targetPathByOs.get(platform) || "";
    } else if (target) {
      this.targetPath = target;
    }
  }

  public get sourcePath(): string {
    return this._sourcePath;
  }

  public set sourcePath(source: string) {
    this._sourcePath = path.resolve(__dirname, "../..", source);
  }

  public get targetPath(): string {
    return this._targetPath;
  }

  public set targetPath(target: string) {
    this._targetPath = path.resolve(__dirname, "../..", target);
  }
}

export { ImagingEdgeMobile };
