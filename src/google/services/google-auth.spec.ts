import Sinon from "sinon";
import { config } from "../../settings/config";
import { GoogleAuth } from "./google-auth";

const auth: GoogleAuth = new GoogleAuth(config.web);

describe("GoogleAuth", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubToken = sandbox.stub(GoogleAuth.prototype, "token");
    stubToken.resolves("ABC123DEF");
  });

  describe("token", () => {
    it("should get the token", async () => {
      const token = await auth.token();
      expect(token.length).toEqual(9);
    });
  });
});
