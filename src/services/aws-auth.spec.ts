import { AuthProvider } from "../interfaces/auth.provider";
import { AwsAuth } from "./aws-auth";
import config from "../settings/aws.config.json";
import Sinon from "sinon";

const auth: AuthProvider = new AwsAuth(config.aws);

describe("AwsAuth", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubToken = sandbox.stub(AwsAuth.prototype, "token");
    stubToken.resolves("AWS123abc");
  });

  describe("token", () => {
    it("should do something...", async () => {
      const token = await auth.token();
      expect(token.length).toEqual(9);
    });
  });
});
