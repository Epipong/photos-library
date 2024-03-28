import Sinon from "sinon";
import { AuthProvider } from "../interfaces/auth.provider";
import { config } from "../settings/config";
import { GoogleAuth } from "./google-auth";
import { GooglePhotosLibrary } from "./google-photos-library";

const auth: AuthProvider = new GoogleAuth(config.web);
const photos = new GooglePhotosLibrary(auth);

describe("GooglePhotosLibrary", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubGetAlbums = sandbox.stub(
      GooglePhotosLibrary.prototype,
      "getAlbums",
    );
    stubGetAlbums.resolves({
      albums: [
        { id: "1", productUrl: "", title: "Title 1" },
        { id: "2", productUrl: "", title: "Title 2" },
      ],
    });
    const stubCreateAlbum = sandbox.stub(
      GooglePhotosLibrary.prototype,
      <any>"createAlbum",
    );
    stubCreateAlbum.resolves({
      id: "3",
      title: "Title 3",
    });
  });

  describe("albums", () => {
    it("should return the albums", async () => {
      const response = await photos.getAlbums();
      expect(response.albums.length).toEqual(2);
      expect(response.albums.pop()).toEqual({
        id: "2",
        productUrl: "",
        title: "Title 2",
      });
    });

    it("should return a new album after creating a new one", async () => {
      const album = await photos["createAlbum"]({});
      expect(album).toEqual({ id: "3", title: "Title 3" });
    });
  });
});
