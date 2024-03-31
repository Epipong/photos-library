type AmazonAlbum = {
  createdBy: string;
  createdDate: string;
  eTagResponse: string;
  id: string;
  isRoot: boolean;
  isShared: boolean;
  kind: string;
  modifiedDate: string;
  name: string;
  ownerId: string;
  protectedFolder: boolean;
  restricted: boolean;
  status: string;
  version: number;
};

type AmazonAlbumsResponse = {
  count: number;
  data: AmazonAlbum[];
};

export { AmazonAlbumsResponse, AmazonAlbum };
