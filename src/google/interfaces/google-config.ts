import { AuthConfig } from "../../interfaces/auth-config";

interface GoogleConfig extends AuthConfig {
  project_id: string;
  auth_provider_x509_cert_url: string;
  redirect_uris: string[];
  redirect_uri: string;
}

export { GoogleConfig };
