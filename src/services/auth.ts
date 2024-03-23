const { exec } = require("child_process");
import axios from "axios";
import { config } from "../settings/config";
import * as readline from 'readline';
import { logger } from "../infrastructures/logger";
import path from "path";
import fs from "fs";
import { tokenResponse } from "../interfaces/tokenResponse";

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
    const targetPath = path.resolve(__dirname, '../settings/.init');
    fs.writeFileSync(targetPath, JSON.stringify(data));
  }

  private readCode() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Code? ', async (answer) => {
      const code = decodeURIComponent(answer);
      try {
        const { data } = await axios.post('https://www.googleapis.com/oauth2/v4/token', new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri
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

  public init() {
    const url = this.createUrl("https://accounts.google.com/o/oauth2/auth", {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.redirectUrls.join(" "),
      response_type: "code",
    });
    const start = this.openCmds.get(process.platform) || "xdg-open";
    exec(`${start} '${url}'`);

    this.readCode();
  }
}

const auth = new Auth(config);

export { auth };
