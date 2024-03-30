import Sinon from "sinon";
import { AuthProvider } from "../../interfaces/auth.provider";
import { config } from "../../settings/config";
import { AmazonAuth } from "./amazon-auth";
import { AmazonPhotos } from "./amazon-photos";
import { amazonAlbum } from "../../fixtures/amazon-album";

const auth: AuthProvider = new AmazonAuth(config.web);
const photos = new AmazonPhotos(auth);

describe("AmazonPhotos", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubGetAlbums = sandbox.stub(AmazonPhotos.prototype, "getAlbums");
    stubGetAlbums.resolves([amazonAlbum]);
  });

  describe("albums", () => {
    it("should return the albums", async () => {
      const albums = await photos.getAlbums();
      expect(albums!.length).toEqual(1);
      expect(albums!.pop()).toEqual(amazonAlbum);
    });
  });
});
