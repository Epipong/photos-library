import { AuthProvider } from "../interfaces/auth.provider";
import { config } from "../settings/config";
import { AmazonAuth } from "./amazon-auth";
import { GoogleAuth } from "./google-auth";

const providers: { [provider: string]: () => AuthProvider } = {
  google: () => new GoogleAuth(config.web),
  amazon: () => new AmazonAuth(config.aws),
};

class AuthFactory {
  public static createAuthProvider({
    provider = config.providerDefault,
  }: {
    provider?: string;
  }): AuthProvider {
    return providers[provider in providers ? provider : "google"]();
  }
}

export { AuthFactory };
