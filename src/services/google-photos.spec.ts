import Sinon from "sinon";
import { AuthProvider } from "../interfaces/auth.provider";
import { config } from "../settings/config";
import { GoogleAuth } from "./google-auth";
import { GooglePhotos } from "./google-photos";

const auth: AuthProvider = new GoogleAuth(config.web);
const photos = new GooglePhotos(auth);

describe("GooglePhotos", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubGetAlbums = sandbox.stub(GooglePhotos.prototype, "getAlbums");
    stubGetAlbums.resolves([
      { id: "1", productUrl: "", title: "Title 1" },
      { id: "2", productUrl: "", title: "Title 2" },
    ]);
    const stubCreateAlbum = sandbox.stub(
      GooglePhotos.prototype,
      <any>"createAlbum",
    );
    stubCreateAlbum.resolves({
      id: "3",
      title: "Title 3",
    });
  });

  describe("albums", () => {
    it("should return the albums", async () => {
      const albums = await photos.getAlbums();
      expect(albums!.length).toEqual(2);
      expect(albums!.pop()).toEqual({
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
