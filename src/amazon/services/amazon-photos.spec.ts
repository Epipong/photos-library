import Sinon from "sinon";
import { config } from "../../settings/config";
import { AmazonAuth } from "./amazon-auth";
import { AmazonPhotos } from "./amazon-photos";
import { album } from "../../fixtures/amazon-album";

const auth = new AmazonAuth(config.web);
const photos = new AmazonPhotos(auth);

describe("AmazonPhotos", () => {
  beforeAll(() => {
    const sandbox = Sinon.createSandbox();
    const stubGetAlbums = sandbox.stub(AmazonPhotos.prototype, "getAlbums");
    stubGetAlbums.resolves([album]);
  });

  describe("albums", () => {
    it("should return the albums", async () => {
      const albums = await photos.getAlbums();
      expect(albums!.length).toEqual(1);
      expect(albums!.pop()).toEqual(album);
    });
  });
});
