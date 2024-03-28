import path from "path";
import { AuthProvider } from "../interfaces/auth.provider";
import { AwsConfig } from "../interfaces/aws-config";
import { S3Client } from "@aws-sdk/client-s3";
import { logger } from "../infrastructures/logger";
import axios, { AxiosError } from "axios";
import { AwsCodePairResponse } from "../interfaces/aws-codepair-response";

class AwsAuth implements AuthProvider {
  readonly awsAuthDir = path.resolve(__dirname, "../settings/.awsphotos_auth");
  readonly apiUrl = 'https://api.amazon.com';

  constructor(private config: AwsConfig) {
  }

  private async getCodePair(): Promise<AwsCodePairResponse | undefined> {
    try {
      const { data } = await axios.post(`${this.apiUrl}/auth/o2/create/codepair`, {
        response_type: "device_code",
        client_id: this.config.clientId,
        scope: "profile"
      });
      return data;
    } catch (err) {
      logger.error(`[getCodePair] message: ${(err as AxiosError).message}`);
      logger.error(`[getCodePair] stack: ${(err as AxiosError).stack}`);
      throw err;
    }
  }

  public async init(): Promise<void> {
    const codePair = await this.getCodePair();
    logger.info(`Visit the link to log in Amazon: ${codePair?.verification_uri}`);
    return;
  }

  public async refresh(): Promise<void> {
    return;
  }

  public async token(): Promise<string> {
    const listParams = {
      Bucket: '',
      Prefix: 'albums/'
    }
    return "";
  }
}

export { AwsAuth };