import { AuthProvider } from "../interfaces/auth.provider";
import { AmazonAuth } from "./amazon-auth";
import config from "../settings/aws.config.json";
import Sinon from "sinon";

const auth: AuthProvider = new AmazonAuth(config.aws);

describe("AmazonAuth", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubToken = sandbox.stub(AmazonAuth.prototype, "token");
    stubToken.resolves("AWS123abc");
  });

  describe("token", () => {
    it("should do something...", async () => {
      const token = await auth.token();
      expect(token.length).toEqual(9);
    });
  });
});
