import axios from "axios";
import { AuthProvider } from "../interfaces/auth.provider";
import { PhotosProvider } from "../interfaces/photos.provider";

class AmazonPhotos implements PhotosProvider {
  constructor(private auth: AuthProvider) {}

  // TODO
  private async createAlbum() {
    const token = await this.auth.token();
    axios.post(
      "https://www.amazon.fr/drive/v1/nodes",
      {
        kind: "VISUAL_COLLECTION",
        name: "Test pour 1",
        resourceVersion: "V2",
        ContentType: "JSON",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  // TODO
  private async getAlbum() {}

  public async main({ title, source }: { title?: string; source?: string }) {
    this.getAlbum();
    return;
  }
}

export { AmazonPhotos };
