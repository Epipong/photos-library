import { exec } from "child_process";
import axios from "axios";
import * as readline from "readline";
import { logger } from "../infrastructures/logger";
import path from "path";
import fs from "fs";
import { GoogleTokenResponse } from "../interfaces/google-token-response";
import { GoogleRequestParams } from "../interfaces/google-request-params";
import { GoogleConfig } from "../interfaces/google-config";
import { Auth } from "./auth";

class GoogleAuth extends Auth {
  projectId: string;
  authProviderUrl: string;
  redirectUrls: string[];
  redirectUri: string;

  constructor(web: GoogleConfig) {
    super(web);
    this.projectId = web.project_id;
    this.authProviderUrl = web.auth_provider_x509_cert_url;
    this.redirectUrls = web.redirect_uris;
    this.redirectUri = web.redirect_uri;
  }

  private createUrl(baseUrl: string, params: GoogleRequestParams): URL {
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();
    return url;
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
}

export { GoogleAuth };
