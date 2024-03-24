import axios from "axios";
import { auth } from "./auth";
import { logger } from "../infrastructures/logger";
import { AlbumsResponse } from "../interfaces/albums-response";

class GooglePhotosLibrary {
  apiBase = 'https://photoslibrary.googleapis.com/v1';

  private async invoke(url: string): Promise<AlbumsResponse | undefined> {
    try {
      const token = await auth.token();
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
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
}

export { GooglePhotosLibrary };