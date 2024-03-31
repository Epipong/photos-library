import { AuthProvider } from "../../interfaces/auth.provider";
import { PhotosProvider } from "../../interfaces/photos.provider";
import { config } from "../../settings/config";
import { AmazonPhotos } from "../../amazon/services/amazon-photos";
import { GooglePhotos } from "../../google/services/google-photos";

const providers: {
  [provider: string]: (auth: AuthProvider) => PhotosProvider;
} = {
  google: (auth) => new GooglePhotos(auth),
  amazon: (auth) => new AmazonPhotos(auth),
};

class PhotosFactory {
  public static createPhotos({
    provider = config.providerDefault,
    auth,
  }: {
    provider?: string;
    auth: AuthProvider;
  }): PhotosProvider {
    return providers[provider in providers ? provider : "google"](auth);
  }
}

export { PhotosFactory };
