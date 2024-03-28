import { AuthProvider } from "../interfaces/auth.provider";
import { config } from "../settings/config";
import { AwsAuth } from "./aws-auth";
import { GoogleAuth } from "./google-auth";

const providers: { [provider: string]: () => AuthProvider } = {
  google: () => new GoogleAuth(config.web),
  amazon: () => new AwsAuth(config.aws),
}

class AuthFactory {
  public static createAuthProvider({ provider = "google" }: { provider?: string; }): AuthProvider {
    return providers[provider in providers ? provider : "google"]();
  }
}

export { AuthFactory };