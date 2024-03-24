import axios from "axios";
import { auth } from "./auth";
import { logger } from "../infrastructures/logger";
import { AlbumsResponse } from "../interfaces/albums-response";

class GooglePhotosTools {
  apiBase = 'https://photoslibrary.googleapis.com/v1';

  private async invoke(url: string): Promise<AlbumsResponse | undefined> {
    try {
      logger.info(`token: ${auth.token()}`)
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${auth.token()}`
        }
      });
      return data;
    } catch (err) {
      logger.error(`[invoke]: ${(err as Error).message}`);
      logger.error(`[invoke]: ${(err as Error).stack}`);
    }
  }

  public async albums() {
    return this.invoke(`${this.apiBase}/albums`);
  }
}

const tools = new GooglePhotosTools();

export { tools };