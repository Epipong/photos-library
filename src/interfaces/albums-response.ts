interface Album {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount: string;
  coverPhotoBaseUrl: string;
  coverPhotoMediaItemId: string;
}

interface AlbumsResponse {
  albums: Album[];
}

export { AlbumsResponse, Album };
