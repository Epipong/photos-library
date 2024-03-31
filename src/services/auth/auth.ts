import { AuthConfig } from "../../interfaces/auth-config";
import path from "path";
import fs from "fs";
import { AuthProvider } from "../../interfaces/auth.provider";
import { logger } from "../../infrastructures/logger";
import axios, { AxiosError, Method } from "axios";

abstract class Auth implements AuthProvider {
  protected clientId: string;
  protected authUri: string;
  protected tokenUri: string;
  protected clientSecret: string;

  constructor(config: AuthConfig) {
    this.clientId = config.client_id;
    this.clientSecret = config.client_secret;
    this.authUri = config.auth_uri;
    this.tokenUri = config.token_uri;
    this.authDir = config.auth_dir;
    this.initFile = path.resolve(this.authDir, "init");
    this.refreshTokenFile = path.resolve(this.authDir, "refresh_token");
    this.accessTokenFile = path.resolve(this.authDir, "access_token");

    if (fs.existsSync(this.accessTokenFile)) {
      this.setAccessTokenCreated();
      this.accessToken = fs.readFileSync(this.accessTokenFile).toString();
    }
    if (fs.existsSync(this.refreshTokenFile)) {
      this.refreshToken = fs.readFileSync(this.refreshTokenFile).toString();
    }
  }

  protected authDir: string;
  protected initFile: string;
  protected refreshTokenFile: string;
  protected accessTokenFile: string;

  protected accessToken?: string;
  protected refreshToken?: string;
  protected accessTokenCreated?: Date;

  protected openCmds: Map<NodeJS.Platform, string> = new Map([
    ["android", "termux-open-url"],
    ["linux", "/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe"],
    ["darwin", "open"],
    ["win32", "start"],
  ]);

  protected async invoke<T>({
    url,
    method = "GET",
    body,
    params,
    contentType = "application/json",
    headers,
  }: {
    url: string;
    method?: Method;
    body?: any;
    params?: any;
    contentType?: string;
    headers?: any;
  }): Promise<T> {
    try {
      const { data } = await axios({
        url,
        method,
        headers: {
          "Content-Type": contentType,
          ...headers,
        },
        data: body,
        params,
      });
      return data;
    } catch (err) {
      logger.error(`[invoke]: ${(err as AxiosError).message}`);
      logger.error(`[invoke]: ${(err as AxiosError).stack}`);
      throw new Error();
    }
  }

  protected setAccessTokenCreated() {
    const { mtime } = fs.statSync(this.accessTokenFile);
    this.accessTokenCreated = mtime;
  }

  protected saveToken(data: { access_token: string; refresh_token: string }) {
    if (!fs.existsSync(this.authDir)) {
      fs.mkdirSync(this.authDir);
    }
    fs.writeFileSync(this.initFile, JSON.stringify(data, null, 2));
    this.accessToken = data.access_token;
    fs.writeFileSync(this.accessTokenFile, data.access_token);
    this.setAccessTokenCreated();
    if (data.refresh_token) {
      fs.writeFileSync(this.refreshTokenFile, data.refresh_token);
      this.refreshToken = data.refresh_token;
    }
  }

  protected isTokenExpired(): boolean {
    if (!this.accessTokenCreated) {
      return true;
    }
    const elapsed = ((Date.now() - +this.accessTokenCreated) / 1000) | 0;
    return elapsed > 3600;
  }

  abstract refresh(): Promise<void>;
  abstract init(): Promise<void>;

  public async token() {
    try {
      if (this.isTokenExpired()) {
        this.refresh();
      }
      this.accessToken = fs.readFileSync(this.accessTokenFile).toString();
      return this.accessToken;
    } catch {
      throw Error("Unknown context. Try to init first.");
    }
  }
}

export { Auth };
