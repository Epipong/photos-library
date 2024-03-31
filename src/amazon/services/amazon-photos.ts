import { AuthProvider } from "../../interfaces/auth.provider";
import { logger } from "../../infrastructures/logger";
import { AmazonAlbum, AmazonAlbumsResponse } from "../interfaces/amazon-albums";
import { stringify } from "../../services/utils/stringify";
import { PhotosLibray } from "../../services/photos/photos-library";

class AmazonPhotos extends PhotosLibray {
  constructor(protected auth: AuthProvider) {
    super(auth);
  }

  protected readonly apiBase = "https://www.amazon.fr";

  public async getAlbums(): Promise<AmazonAlbum[] | undefined> {
    const result: AmazonAlbumsResponse = await this.invoke({
      path: "/drive/v1/search",
      params: {
        searchContext: "customer",
        filters: encodeURI("type:(ALBUMS)"),
      },
    });
    return result.data;
  }

  public async main({ title, source }: { title?: string; source?: string }) {
    const albums = await this.getAlbums();
    if (title) {
      const album = albums?.find((album) => album.name.includes(title));
      logger.debug(stringify(album));
    }
    return;
  }
}

export { AmazonPhotos };
