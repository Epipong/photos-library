import axios from "axios";
import { AuthProvider } from "../interfaces/auth.provider";
import { PhotosProvider } from "../interfaces/photos.provider";
import { logger } from "../infrastructures/logger";
import { AmazonAlbum, AmazonAlbumsResponse } from "../interfaces/amazon-albums";
import { stringify } from "../utils/stringify";

class AmazonPhotos implements PhotosProvider {
  constructor(private auth: AuthProvider) {}

  private async getAlbums(): Promise<AmazonAlbum[]> {
    const token = await this.auth.token();
    const { data } = await axios.get<AmazonAlbumsResponse>(
      `https://www.amazon.fr/drive/v1/search?filters=type%3A(ALBUMS)&sort=%5B%27createdDate+DESC%27%5D`,
      {
        params: {
          asset: "ALL",
          lowResThumbnail: true,
          limit: 200,
          searchContext: "customer",
          tempLink: false,
          resourceVersion: "V2",
          ContentType: "JSON",
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return data.data;
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
