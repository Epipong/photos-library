import { AuthProvider } from "../interfaces/auth.provider";
import { config } from "../settings/config";
import { GoogleAuth } from "./google-auth";
import { GooglePhotosLibrary } from "./google-photos-library";

describe("GooglePhotosLibrary", () => {
  describe("albums", () => {
    it("should be true", () => {
      const auth: AuthProvider = new GoogleAuth(config);
      const photos = new GooglePhotosLibrary(auth);
      expect(photos).toBeTruthy();
    });
  });
});
