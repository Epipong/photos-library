import { AuthProvider } from "../interfaces/auth.provider";
import { AwsAuth } from "./aws-auth";
import config from "../settings/aws.config.json";

const auth: AuthProvider = new AwsAuth(config);

describe("AwsAuth", () => {
  describe("token", () => {
    it("should do something...", async () => {
      const token = await auth.token();
      expect(token.length).toEqual(0);
    });
  });
});