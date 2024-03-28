interface Album {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount?: string;
  coverPhotoBaseUrl?: string;
  coverPhotoMediaItemId?: string;
  isWriteable?: string;
}

interface AlbumsResponse {
  albums: Album[];
}

interface AlbumRequest extends Partial<Album> {
  id?: string;
  productUrl?: string;
}

export { AlbumsResponse, AlbumRequest, Album };
