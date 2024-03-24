import axios from "axios";
import { auth } from "./auth";
import { logger } from "../infrastructures/logger";
import { AlbumsResponse } from "../interfaces/albums-response";

class GooglePhotosLibrary {
  apiBase = 'https://photoslibrary.googleapis.com/v1';

  private async invoke(url: string): Promise<AlbumsResponse | undefined> {
    try {
      return await auth.token()
        .then(async (token) => {
          const { data } = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return data;
        });
    } catch (err) {
      logger.error(`[invoke]: ${(err as Error).message}`);
      logger.error(`[invoke]: ${(err as Error).stack}`);
    }
  }

  public async getAlbums() {
    return this.invoke(`${this.apiBase}/albums`);
  }

  public async publishToAlbum() {
    //
  }

  public async main({ title }: { title?: string }) {
    const result = await this.getAlbums();
    if (title) {
      logger.info(title)
      const album = result!.albums.find(album => album.title.includes(title))
      logger.info(JSON.stringify(album, null, 2));
    } else {
      logger.info(JSON.stringify(result, null, 2));
    }
  }
}

export { GooglePhotosLibrary };