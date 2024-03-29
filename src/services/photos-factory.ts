import { AuthProvider } from "../interfaces/auth.provider";
import { PhotosProvider } from "../interfaces/photos.provider";
import { config } from "../settings/config";
import { AwsPhotosLibrary } from "./aws-photos-library";
import { GooglePhotosLibrary } from "./google-photos-library";

const providers: {
  [provider: string]: (auth: AuthProvider) => PhotosProvider;
} = {
  google: (auth) => new GooglePhotosLibrary(auth),
  amazon: (auth) => new AwsPhotosLibrary(auth),
};

class PhotosFactory {
  public static createPhotosProvider({
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
