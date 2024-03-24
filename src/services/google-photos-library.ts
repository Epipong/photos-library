import axios, { AxiosError, Method } from "axios";
import { auth } from "./auth";
import { logger } from "../infrastructures/logger";
import { Album, AlbumsResponse } from "../interfaces/albums-response";
import fs from "fs";
import path from "path";
import { MediaItem } from "../interfaces/media-item";
import cliProgress from "cli-progress";

class GooglePhotosLibrary {
  apiBase = "https://photoslibrary.googleapis.com";

  private async invoke({
    url,
    method = "GET",
    body,
    params,
    contentType = "application/json",
    headers,
  }: {
    url: string;
    method?: Method;
    body?: any;
    params?: any;
    contentType?: string;
    headers?: any;
  }) {
    try {
      const token = await auth.token();
      const { data } = await axios({
        url,
        method,
        headers: {
          "Content-Type": contentType,
          Authorization: `Bearer ${token}`,
          ...headers,
        },
        data: body,
        params,
      });
      return data;
    } catch (err) {
      logger.error(`[invoke] message: ${(err as AxiosError).message}`);
      logger.error(JSON.stringify((err as AxiosError).response?.data, null, 2));
    }
  }

  public async getAlbums(): Promise<AlbumsResponse> {
    return this.invoke({ url: `${this.apiBase}/v1/albums` });
  }

  public async batchCreateMediaItems({
    albumId,
    newMediaItems,
  }: {
    albumId: string;
    newMediaItems: MediaItem[];
  }) {
    for (let i = 0; i < newMediaItems.length; i += 50) {
      const items = newMediaItems.slice(i, i + 50);
      await this.invoke({
        url: `${this.apiBase}/v1/mediaItems:batchCreate`,
        method: "POST",
        body: {
          albumId: albumId,
          newMediaItems: items,
        },
      });
    }
  }

  private async uploadMedia(source: string) {
    const images = fs
      .readdirSync(source, { recursive: true })
      .filter((file) => (file as string).endsWith(".JPG"));
    const mediaItems: MediaItem[] = [];
    const bar = new cliProgress.SingleBar(
      {
        format:
          " {bar} | {percentage}% | {filename} | ETA: {eta}s | {value}/{total}",
      },
      cliProgress.Presets.shades_grey,
    );
    bar.start(images.length, 0);
    for (const img of images) {
      const imgPath = path.resolve(source, img as string);
      const fileData = fs.readFileSync(imgPath);
      const uploadToken = await this.invoke({
        url: `${this.apiBase}/v1/uploads`,
        method: "POST",
        contentType: "application/octet-stream",
        headers: {
          "X-Goog-Upload-Content-Type": "mime-type",
          "X-Goog-Upload-Protocol": "raw",
        },
        body: fileData,
      });
      const filename = (img as string).split("/").pop()!
      const item: MediaItem = {
        description: "",
        simpleMediaItem: {
          uploadToken: uploadToken,
          fileName: filename,
        },
      };
      mediaItems.push(item);
      bar.increment({ filename });
    }
    bar.stop();
    return mediaItems;
  }

  private async createAlbum(title: string): Promise<Album> {
    return this.invoke({
      url: `${this.apiBase}/v1/albums`,
      method: "POST",
      body: {
        album: {
          title: title,
        },
      },
    });
  }

  public async main({ title, source }: { title?: string; source?: string }) {
    const result = await this.getAlbums();
    if (title) {
      const album = result.albums?.find((album: Album) =>
        album.title.includes(title),
      ) || await this.createAlbum(title);
      if (source) {
        const mediaItems = await this.uploadMedia(source);
        await this.batchCreateMediaItems({
          albumId: album.id,
          newMediaItems: mediaItems,
        });
      }
    }
  }
}

export { GooglePhotosLibrary };
