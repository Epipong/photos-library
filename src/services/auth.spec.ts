import { AuthProvider } from "../interfaces/auth.provider";
import { config } from "../settings/config";
import { GoogleAuth } from "../google/services/google-auth";

describe("auth", () => {
  describe("init", () => {
    it("should be true", () => {
      const auth: AuthProvider = new GoogleAuth(config.web);
      expect(auth).toBeTruthy();
    });
  });
});
