import { exec } from "child_process";
import * as readline from "readline";
import { GoogleTokenResponse } from "../interfaces/google-token-response";
import { GoogleRequestParams } from "../interfaces/google-request-params";
import { GoogleConfig } from "../interfaces/google-config";
import { Auth } from "../../services/auth";

class GoogleAuth extends Auth {
  projectId: string;
  authProviderUrl: string;
  redirectUrls: string[];
  redirectUri: string;

  constructor(cfg: GoogleConfig) {
    super(cfg);
    this.projectId = cfg.project_id;
    this.authProviderUrl = cfg.auth_provider_x509_cert_url;
    this.redirectUrls = cfg.redirect_uris;
    this.redirectUri = cfg.redirect_uri;
  }

  private createUrl(baseUrl: string, params: GoogleRequestParams): URL {
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();
    return url;
  }

  private async getToken(code: string): Promise<GoogleTokenResponse> {
    return this.invoke({
      url: this.tokenUri,
      method: "POST",
      body: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: this.redirectUri,
      },
    });
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
          const data = await this.getToken(code);
          this.saveToken(data);
          rl.close();
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
