import { AuthProvider } from "../interfaces/auth.provider";
import { PhotosProvider } from "../interfaces/photos.provider";

class AwsPhotosLibrary implements PhotosProvider {
  constructor(private auth: AuthProvider) {}

  public async main({ title, source }: { title?: string; source?: string }) {
    return;
  }
}

export { AwsPhotosLibrary };
