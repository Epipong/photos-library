const { exec } = require("child_process");
import axios from "axios";
import { config } from "../settings/config";
import * as readline from 'readline';
import { logger } from "../infrastructures/logger";
import path from "path";
import fs from "fs";
import { tokenResponse } from "../interfaces/token-response";

class Auth {
  clientId: string;
  projectId: string;
  authUri: string;
  tokenUri: string;
  authProviderUrl: string;
  clientSecret: string;
  redirectUrls: string[];
  redirectUri: string;

  openCmds: Map<NodeJS.Platform, string> = new Map([
    ["android", "termux-open-url"],
    ["linux", "/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe"],
    ["darwin", "open"],
    ["win32", "start"],
  ]);

  readonly gPhotoAuthDir = path.resolve(__dirname, '../settings/.gphotos_auth');
  readonly initFile = path.resolve(this.gPhotoAuthDir, 'init');
  readonly refreshTokenFile = path.resolve(this.gPhotoAuthDir, 'refresh_token');
  readonly accessTokenFile = path.resolve(this.gPhotoAuthDir, 'access_token');

  constructor({
    client_id,
    project_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_secret,
    redirect_uris,
    redirect_uri,
  }: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
    redirect_uri: string;
  }) {
    this.clientId = client_id;
    this.projectId = project_id;
    this.authUri = auth_uri;
    this.tokenUri = token_uri;
    this.authProviderUrl = auth_provider_x509_cert_url;
    this.clientSecret = client_secret;
    this.redirectUrls = redirect_uris;
    this.redirectUri = redirect_uri;
  }

  private createUrl(baseUrl: string, params: {}): URL {
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();
    return url;
  }

  private saveToken(data: tokenResponse) {
    if (!fs.existsSync(this.gPhotoAuthDir)) {
      fs.mkdirSync(this.gPhotoAuthDir);
    }
    fs.writeFileSync(this.initFile, JSON.stringify(data, null, 2));
    fs.writeFileSync(this.accessTokenFile, data.access_token);
    if (data.refresh_token) {
      fs.writeFileSync(this.refreshTokenFile, data.refresh_token);
    }
  }

  private readCode() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Code? ', async (answer) => {
      const code = decodeURIComponent(answer);
      try {
        const { data } = await axios.post(config.token_uri, new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }).toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        this.saveToken(data);
      } catch (err) {
        logger.error(err);
      }
      rl.close();
    });
  }

  private age(filepath: string) {
    const { mtime } = fs.statSync(filepath);
    return (Date.now() - +mtime) / 1000 | 0;
  }

  public async refresh() {
    logger.info(`time to refresh`);
    const refreshToken = fs.readFileSync(this.refreshTokenFile).toString();

    const { data } = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    logger.info(JSON.stringify(data))
  }

  public init() {
    const url = this.createUrl(config.auth_uri, {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.redirectUrls.join(" "),
      response_type: "code",
    });
    const start = this.openCmds.get(process.platform) || "xdg-open";
    exec(`${start} '${url}'`);

    this.readCode();
  }

  public token() {
    try {
      const accessToken = fs.readFileSync(this.accessTokenFile).toString();
      const age = this.age(this.accessTokenFile);
      logger.info(`age: ${age}`);
      if (age > 3600) {
        this.refresh();
      }
    } catch {
      throw Error("Unknown context. Try initing first.");
    }
  }
}

const auth = new Auth(config);

export { auth };
