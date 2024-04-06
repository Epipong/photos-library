import axios, { Method } from "axios";
import { PhotosProvider } from "../../interfaces/photos.provider";
import { AuthProvider } from "../../interfaces/auth.provider";
import { logError } from "../../infrastructures/logger";

abstract class PhotosLibray implements PhotosProvider {
  constructor(protected auth: AuthProvider) {}

  protected abstract readonly apiBase: string;

  protected async invoke({
    path,
    method = "GET",
    body,
    params,
    contentType = "application/json",
    headers,
  }: {
    path: string;
    method?: Method;
    body?: any;
    params?: any;
    contentType?: string;
    headers?: any;
  }) {
    try {
      const token = await this.auth.token();
      const { data } = await axios({
        url: `${this.apiBase}/${path}`,
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
    } catch (err: any) {
      logError(err);
      throw new Error();
    }
  }

  abstract getAlbums(): Promise<any>;

  abstract main({
    title,
    source,
  }: {
    title?: string;
    source?: string;
  }): Promise<void>;
}

export { PhotosLibray };
