import path from "path";
import { AuthProvider } from "../interfaces/auth.provider";
import { AwsConfig } from "../interfaces/aws-config";
import { logger } from "../infrastructures/logger";
import axios, { AxiosError } from "axios";
import { AwsCodePairResponse } from "../interfaces/aws-codepair-response";
import { AswTokenResponse } from "../interfaces/aws-token-response";
import * as readline from "readline";
import fs from "fs";
import { exec } from "child_process";

class AwsAuth implements AuthProvider {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenCreated?: Date;

  openCmds: Map<NodeJS.Platform, string> = new Map([
    ["android", "termux-open-url"],
    ["linux", "/mnt/c/Program\\ Files/Google/Chrome/Application/chrome.exe"],
    ["darwin", "open"],
    ["win32", "start"],
  ]);

  readonly awsAuthDir = path.resolve(__dirname, "../settings/.awsphotos_auth");
  readonly initFile = path.resolve(this.awsAuthDir, "init");
  readonly accessTokenFile = path.resolve(this.awsAuthDir, "access_token");
  readonly refreshTokenFile = path.resolve(this.awsAuthDir, "refresh_token");
  readonly apiUrl = "https://api.amazon.com";

  constructor(private config: AwsConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;

    if (fs.existsSync(this.accessTokenFile)) {
      this.setAccessTokenCreated();
    }
    if (fs.existsSync(this.accessTokenFile)) {
      this.accessToken = fs.readFileSync(this.accessTokenFile).toString();
    }
    if (fs.existsSync(this.refreshTokenFile)) {
      this.refreshToken = fs.readFileSync(this.refreshTokenFile).toString();
    }
  }

  private setAccessTokenCreated() {
    const { mtime } = fs.statSync(this.accessTokenFile);
    this.accessTokenCreated = mtime;
  }

  private async getCodePair(): Promise<AwsCodePairResponse> {
    const { data } = await axios.post(
      `${this.apiUrl}/auth/o2/create/codepair`,
      {
        response_type: "device_code",
        client_id: this.config.clientId,
        scope: "profile",
      },
    );
    return data;
  }

  private saveToken(data: AswTokenResponse) {
    if (!fs.existsSync(this.awsAuthDir)) {
      fs.mkdirSync(this.awsAuthDir);
    }
    fs.writeFileSync(this.initFile, JSON.stringify(data, null, 2));
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    fs.writeFileSync(this.accessTokenFile, this.accessToken);
    fs.writeFileSync(this.refreshTokenFile, this.refreshToken);
    this.setAccessTokenCreated();
  }

  private async getToken(
    codePair: AwsCodePairResponse,
  ): Promise<AswTokenResponse> {
    const { data } = await axios.post(`${this.apiUrl}/auth/o2/token`, {
      user_code: codePair.user_code,
      device_code: codePair.device_code,
      grant_type: "device_code",
    });
    return data;
  }

  private async continue(codePair: AwsCodePairResponse) {
    return new Promise(() => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question("Press enter when it's done.", async (_) => {
        const token = await this.getToken(codePair);
        this.saveToken(token);
        rl.close();
      });
    });
  }

  private openAuthLink(codePair: AwsCodePairResponse) {
    logger.info(`[user_code]: ${codePair?.user_code}`);
    logger.info(`[device_code]: ${codePair?.device_code}`);
    logger.info(
      `Visit the link to log in Amazon: ${codePair?.verification_uri}`,
    );
    const start = this.openCmds.get(process.platform) || "xdg-open";
    exec(`${start} '${codePair.verification_uri}'`);
  }

  private isTokenExpired(): boolean {
    if (!this.accessTokenCreated) {
      return true;
    }
    const elapsed = ((Date.now() - +this.accessTokenCreated) / 1000) | 0;
    return elapsed > 3600;
  }

  public async refresh() {
    const { data } = await axios.post(`${this.apiUrl}/auth/o2/token`, {
      grant_type: "refresh_token",
      refresh_token: this.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });
    this.saveToken(data);
  }

  public async init() {
    const codePair = await this.getCodePair();
    this.openAuthLink(codePair);
    await this.continue(codePair);
  }

  public async token(): Promise<string> {
    try {
      if (this.isTokenExpired()) {
        this.refresh();
      }
      logger.info(JSON.stringify(this.accessToken, null, 2));
      return this.accessToken!;
    } catch {
      throw Error("Unknown context. Try initing first.");
    }
  }
}

export { AwsAuth };
