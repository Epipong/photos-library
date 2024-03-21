import path from "path";

class ImagingEdgeMobile {
  private readonly sourcePathByOs: Map<NodeJS.Platform, string> = new Map([
    ["android", "/storage/0000-0000"],
    ["linux", "/mnt/e"],
  ]);

  private readonly targetPathByOs: Map<NodeJS.Platform, string> = new Map([
    ["android", "storage/pictures/sony"],
    ["linux", "davy/Pictures/Sony"],
  ]);

  /**
   * Imaging Edge Mobile class.
   * @param _sourcePath relative path to the source folder.
   * @param _targetPath relative path to the target folder.
   */
  constructor(
    private _sourcePath?: string,
    private _targetPath?: string,
  ) {
    if (!_sourcePath && this.sourcePathByOs.has(process.platform)) {
      this._sourcePath = this.sourcePathByOs.get(process.platform);
    } else if (_sourcePath) {
      this.sourcePath = _sourcePath;
    }

    if (!_targetPath && this.targetPathByOs.has(process.platform)) {
      this._targetPath = this.sourcePathByOs.get(process.platform);
    } else if (_targetPath) {
      this.targetPath = _targetPath;
    }
  }

  public get sourcePath(): string | undefined {
    return this._sourcePath;
  }

  public set sourcePath(source: string) {
    this._sourcePath = path.resolve(__dirname, source);
  }

  public get targetPath(): string | undefined {
    return this._targetPath;
  }

  public set targetPath(target: string) {
    this._targetPath = path.resolve(__dirname, target);
  }
}

export { ImagingEdgeMobile };
