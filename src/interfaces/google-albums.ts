interface GoogleAlbum {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount?: string;
  coverPhotoBaseUrl?: string;
  coverPhotoMediaItemId?: string;
  isWriteable?: string;
}

interface GoogleAlbumsResponse {
  albums: GoogleAlbum[];
}

interface GoogleAlbumRequest extends Partial<GoogleAlbum> {
  id?: string;
  productUrl?: string;
}

export { GoogleAlbumsResponse, GoogleAlbumRequest, GoogleAlbum };
