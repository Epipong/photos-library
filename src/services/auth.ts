const { exec } = require("child_process");
import axios from "axios";
import { config } from "../settings/config";
import * as readline from "readline";
import { logger } from "../infrastructures/logger";
import path from "path";
import fs from "fs";
import { tokenResponse } from "../interfaces/token-response";
import { GoogleRequestParams } from "../interfaces/google-request-params";
import { GoogleOauth2Web } from "../interfaces/google-oauth2-web";

class Auth {
  clientId: string;
  projectId: string;
  authUri: string;
  tokenUri: string;
  authProviderUrl: string;
  clientSecret: string;
  redirectUrls: string[];
  redirectUri: string;

  accessToken?: string;
  refreshToken?: string;

  openCmds: Map<NodeJS.Platform, string> = new Map([
    ["android", "termux-open-url"],
    ["linux", "/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe"],
    ["darwin", "open"],
    ["win32", "start"],
  ]);

  readonly gPhotoAuthDir = path.resolve(__dirname, "../settings/.gphotos_auth");
  readonly initFile = path.resolve(this.gPhotoAuthDir, "init");
  readonly refreshTokenFile = path.resolve(this.gPhotoAuthDir, "refresh_token");
  readonly accessTokenFile = path.resolve(this.gPhotoAuthDir, "access_token");

  constructor(web: GoogleOauth2Web) {
    this.clientId = web.client_id;
    this.projectId = web.project_id;
    this.authUri = web.auth_uri;
    this.tokenUri = web.token_uri;
    this.authProviderUrl = web.auth_provider_x509_cert_url;
    this.clientSecret = web.client_secret;
    this.redirectUrls = web.redirect_uris;
    this.redirectUri = web.redirect_uri;
  }

  private createUrl(baseUrl: string, params: GoogleRequestParams): URL {
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();
    return url;
  }

  private saveToken(data: tokenResponse) {
    if (!fs.existsSync(this.gPhotoAuthDir)) {
      fs.mkdirSync(this.gPhotoAuthDir);
    }
    fs.writeFileSync(this.initFile, JSON.stringify(data, null, 2));
    this.accessToken = data.access_token;
    fs.writeFileSync(this.accessTokenFile, data.access_token);
    if (data.refresh_token) {
      fs.writeFileSync(this.refreshTokenFile, data.refresh_token);
      this.refreshToken = data.refresh_token;
    }
  }

  private async generateToken(code: string): Promise<tokenResponse> {
    const { data } = await axios.post(
      config.token_uri,
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return data;
  }

  private readCode() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code? ", async (answer) => {
      const code = decodeURIComponent(answer);
      try {
        const data = await this.generateToken(code);
        this.saveToken(data);
      } catch (err) {
        logger.error(`[readCode]: ${(err as Error).message}`);
        logger.error(`[readCode]: ${(err as Error).stack}`);
      }
      rl.close();
    });
  }

  private isTokenExpired(filepath: string): boolean {
    const { mtime } = fs.statSync(filepath);
    const elapsed = ((Date.now() - +mtime) / 1000) | 0;
    logger.info(`elapsed time: ${elapsed}s`);
    return elapsed > 3600;
  }

  private openAuthLink() {
    const url = this.createUrl(config.auth_uri, {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.redirectUrls.join(" "),
      response_type: "code"
    });
    const start = this.openCmds.get(process.platform) || "xdg-open";
    exec(`${start} '${url}'`);
  }

  public async refresh() {
    this.openAuthLink();
    this.readCode();
  }

  public async init() {
    this.openAuthLink();
    this.readCode();
  }

  public token(): string {
    try {
      if (this.isTokenExpired(this.accessTokenFile)) {
        this.refresh();
      }
      this.accessToken = fs.readFileSync(this.accessTokenFile).toString();
      return this.accessToken;
    } catch {
      throw Error("Unknown context. Try initing first.");
    }
  }
}

const auth = new Auth(config);

export { auth };
