import { GooglePhotosLibrary } from "./google-photos-library";

describe("GooglePhotosLibrary", () => {
  describe("albums", () => {
    it("should be true", () => {
      const photos = new GooglePhotosLibrary();
      expect(photos).toBeTruthy();
    });
  });
});
