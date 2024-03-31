import { AmazonAuth } from "./amazon-auth";
import config from "../../settings/amazon.config.json";
import Sinon from "sinon";

const auth = new AmazonAuth(config.amz);

describe("AmazonAuth", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubToken = sandbox.stub(AmazonAuth.prototype, "token");
    stubToken.resolves("ABC123DEF");
  });

  describe("token", () => {
    it("should get the token", async () => {
      const token = await auth.token();
      expect(token.length).toEqual(9);
    });
  });
});
