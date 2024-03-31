import fs from "fs";
import path from "path";
import { AuthProvider } from "../../interfaces/auth.provider";
import { AmazonConfig } from "../interfaces/amazon-config";
import { logger } from "../../infrastructures/logger";
import { AmazonCodePairResponse } from "../interfaces/amazon-codepair-response";
import { AmazonTokenResponse } from "../interfaces/amazon-token-response";
import * as readline from "readline";
import { exec } from "child_process";
import { Auth } from "../../services/auth/auth";
import { Cookie } from "../../entities/cookie";

class AmazonAuth extends Auth implements AuthProvider {
  cookieFile: string;
  cookie?: Cookie;

  constructor(cfg: AmazonConfig) {
    super(cfg);
    this.cookieFile = path.resolve(this.authDir, "cookie");
    if (fs.existsSync(this.cookieFile)) {
      const cookieRaw = fs.readFileSync(this.cookieFile).toString();
      this.cookie = new Cookie(cookieRaw);
      logger.debug(this.cookie.toJSON());
    }
  }

  private async getCodePair(): Promise<AmazonCodePairResponse> {
    return this.invoke<AmazonCodePairResponse>({
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
    codePair: AmazonCodePairResponse,
  ): Promise<AmazonTokenResponse> {
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

  private async continue(codePair: AmazonCodePairResponse) {
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

  private openAuthLink(codePair: AmazonCodePairResponse) {
    logger.info(`[user_code]: ${codePair?.user_code}`);
    logger.info(
      `Visit the link to log in Amazon and copy / paste the [user_code].`,
    );
    const start = this.openCmds.get(process.platform) || "xdg-open";
    exec(`${start} '${codePair.verification_uri}'`);
  }

  public async refresh() {
    const data = await this.invoke<AmazonTokenResponse>({
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

export { AmazonAuth };
