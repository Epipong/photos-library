import { PhotosProvider } from "../interfaces/photos.provider";

abstract class PhotosLibray implements PhotosProvider {
  abstract main: ({ title, source, }: { title?: string | undefined; source?: string | undefined; }) => Promise<void>;
}

export { PhotosLibray };