import { exec } from "child_process";
import axios from "axios";
import * as readline from "readline";
import { logger } from "../infrastructures/logger";
import path, { resolve } from "path";
import fs from "fs";
import { GoogleTokenResponse } from "../interfaces/google-token-response";
import { GoogleRequestParams } from "../interfaces/google-request-params";
import { GoogleConfig } from "../interfaces/google-config-web";
import { AuthProvider } from "../interfaces/auth.provider";

class GoogleAuth implements AuthProvider {
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
  accessTokenCreated?: Date;

  openCmds: Map<NodeJS.Platform, string> = new Map([
    ["android", "termux-open-url"],
    ["linux", "/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe"],
    ["darwin", "open"],
    ["win32", "start"],
  ]);

  readonly gAuthDir = path.resolve(__dirname, "../settings/.gphotos_auth");
  readonly initFile = path.resolve(this.gAuthDir, "init");
  readonly refreshTokenFile = path.resolve(this.gAuthDir, "refresh_token");
  readonly accessTokenFile = path.resolve(this.gAuthDir, "access_token");

  constructor(web: GoogleConfig) {
    this.clientId = web.client_id;
    this.projectId = web.project_id;
    this.authUri = web.auth_uri;
    this.tokenUri = web.token_uri;
    this.authProviderUrl = web.auth_provider_x509_cert_url;
    this.clientSecret = web.client_secret;
    this.redirectUrls = web.redirect_uris;
    this.redirectUri = web.redirect_uri;

    if (fs.existsSync(this.accessTokenFile)) {
      this.setAccessTokenCreated();
    }
  }

  private setAccessTokenCreated() {
    const { mtime } = fs.statSync(this.accessTokenFile);
    this.accessTokenCreated = mtime;
  }

  private createUrl(baseUrl: string, params: GoogleRequestParams): URL {
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();
    return url;
  }

  private saveToken(data: GoogleTokenResponse) {
    if (!fs.existsSync(this.gAuthDir)) {
      fs.mkdirSync(this.gAuthDir);
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

  private async generateToken(code: string): Promise<GoogleTokenResponse> {
    const { data } = await axios.post(
      this.tokenUri,
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

  private async readCode() {
    return new Promise(() => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        "Paste the link after the authentication: ",
        async (answer) => {
          const url = new URL(answer);
          const code = decodeURIComponent(url.searchParams.get("code")!);
          try {
            const data = await this.generateToken(code);
            this.saveToken(data);
          } catch (err) {
            logger.error(`[readCode]: ${(err as Error).message}`);
            logger.error(`[readCode]: ${(err as Error).stack}`);
          } finally {
            rl.close();
          }
        },
      );
    });
  }

  private isTokenExpired(): boolean {
    if (!this.accessTokenCreated) {
      return true;
    }
    const elapsed = ((Date.now() - +this.accessTokenCreated) / 1000) | 0;
    return elapsed > 3600;
  }

  private openAuthLink() {
    const url = this.createUrl(this.authUri, {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.redirectUrls.join(" "),
      response_type: "code",
    });
    const start = this.openCmds.get(process.platform) || "xdg-open";
    exec(`${start} '${url}'`);
  }

  public async refresh() {
    this.openAuthLink();
    await this.readCode();
  }

  public async init() {
    this.refresh();
  }

  public async token(): Promise<string> {
    try {
      if (this.isTokenExpired()) {
        this.refresh();
      }
      this.accessToken = fs.readFileSync(this.accessTokenFile).toString();
      return this.accessToken;
    } catch {
      throw Error("Unknown context. Try initing first.");
    }
  }
}

export { GoogleAuth };
