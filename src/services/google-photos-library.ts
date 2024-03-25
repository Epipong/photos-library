import axios, { AxiosError, Method } from "axios";
import { logger } from "../infrastructures/logger";
import { Album, AlbumRequest, AlbumsResponse } from "../interfaces/albums";
import fs from "fs";
import path from "path";
import { MediaItem } from "../interfaces/media-item";
import { singleBar as bar } from "../entities/single-bar";
import { PhotosProvider } from "../interfaces/photos.provider";
import { AuthProvider } from "../interfaces/auth.provider";

class GooglePhotosLibrary implements PhotosProvider {
  constructor(
    private auth: AuthProvider,
  ) {}

  private readonly apiBase = "https://photoslibrary.googleapis.com";
  private readonly chunkSize = 50;

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
      const token = await this.auth.token();
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

  /**
   * Get all albums.
   * @returns a promise of an array of albums.
   */
  public async getAlbums(): Promise<AlbumsResponse> {
    return this.invoke({ url: `${this.apiBase}/v1/albums` });
  }

  /**
   * Upload the media items per batch of 50.
   * @param albumId album id.
   * @param newMediaItems list of media items to upload.
   */
  private async batchCreateMediaItems({
    albumId,
    newMediaItems,
  }: {
    albumId: string;
    newMediaItems: MediaItem[];
  }) {
    for (let i = 0; i < newMediaItems.length; i += this.chunkSize) {
      const items = newMediaItems.slice(i, i + this.chunkSize);
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

  /**
   * Upload the images file buffer.
   * @param source source path of the images to upload.
   * @returns the media items list.
   */
  private async uploadMedia(source: string) {
    const images = fs
      .readdirSync(source, { recursive: true })
      .filter((file) => (file as string).endsWith(".JPG"));
    const mediaItems: MediaItem[] = [];
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

  /**
   * Create a new album photo.
   * @param title title of the album.
   * @returns a promise of the album.
   */
  private async createAlbum(album: AlbumRequest): Promise<Album> {
    return this.invoke({
      url: `${this.apiBase}/v1/albums`,
      method: "POST",
      body: {
        album
      },
    });
  }

  /**
   * Create or get the album by title given and upload the images to Google Photos.
   * @param title title of the album.
   * @param source source path of the images to upload.
   */
  public async main({ title, source }: { title?: string; source?: string }) {
    const result = await this.getAlbums();
    if (title) {
      const album = result.albums?.find((album: Album) =>
        album.title.includes(title),
      ) || await this.createAlbum({ title });
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
