interface AlbumsResponse {
  albums: {
    id: string;
    title: string;
    productUrl: string;
    mediaItemsCount: string;
    coverPhotoBaseUrl: string;
    coverPhotoMediaItemId: string;
  }
};

export { AlbumsResponse };