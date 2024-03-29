import path from "path";
import { AuthProvider } from "../interfaces/auth.provider";
import { AwsConfig } from "../interfaces/aws-config";
import { logger } from "../infrastructures/logger";
import { AwsCodePairResponse } from "../interfaces/aws-codepair-response";
import { AswTokenResponse } from "../interfaces/aws-token-response";
import * as readline from "readline";
import { exec } from "child_process";
import { Auth } from "./auth";

class AwsAuth extends Auth implements AuthProvider {
  readonly awsAuthDir = path.resolve(__dirname, "../settings/.awsphotos_auth");
  readonly initFile = path.resolve(this.awsAuthDir, "init");
  readonly accessTokenFile = path.resolve(this.awsAuthDir, "access_token");
  readonly refreshTokenFile = path.resolve(this.awsAuthDir, "refresh_token");

  constructor(aws: AwsConfig) {
    super(aws);
  }

  private async getCodePair(): Promise<AwsCodePairResponse> {
    return this.invoke<AwsCodePairResponse>({
      url: this.authUri,
      method: "POST",
      body: {
        response_type: "device_code",
        client_id: this.clientId,
        scope: "profile",
      },
    });
  }

  private async getToken(
    codePair: AwsCodePairResponse,
  ): Promise<AswTokenResponse> {
    return this.invoke({
      url: this.tokenUri,
      method: "POST",
      body: {
        user_code: codePair.user_code,
        device_code: codePair.device_code,
        grant_type: "device_code",
      },
    });
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
    logger.info(
      `Visit the link to log in Amazon and copy / paste the [user_code].`,
    );
    const start = this.openCmds.get(process.platform) || "xdg-open";
    exec(`${start} '${codePair.verification_uri}'`);
  }

  public async refresh() {
    const data = await this.invoke<AswTokenResponse>({
      url: this.tokenUri,
      method: "POST",
      body: {
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      },
    });
    this.saveToken(data);
  }

  public async init() {
    const codePair = await this.getCodePair();
    this.openAuthLink(codePair);
    await this.continue(codePair);
  }
}

export { AwsAuth };
