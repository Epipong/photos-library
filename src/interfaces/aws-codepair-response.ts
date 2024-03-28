interface AwsCodePairResponse {
  user_code: string;
  device_code: string;
  interval: number;
  verification_uri: string;
  expires_in: number;
}

export { AwsCodePairResponse };
