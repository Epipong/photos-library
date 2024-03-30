type AmazonAlbum = {
  accessRuleIds: [];
  childAssetTypeInfo: [];
  collectionProperties: {
    covers: [
      {
        id: string;
        isDefault: true;
        ownerId: string;
      },
    ];
    query: {
      excludedIds: [];
      include: [];
    };
  };
  createdBy: string;
  createdDate: string;
  eTagResponse: string;
  groupPermissions: [];
  id: string;
  isRoot: boolean;
  isShared: boolean;
  keywords: [];
  kind: string;
  labels: [];
  modifiedDate: string;
  name: string;
  ownerId: string;
  parentMap: {};
  parents: [];
  protectedFolder: boolean;
  restricted: boolean;
  status: string;
  subKinds: [];
  transforms: [];
  version: number;
  xAccntParentMap: {};
  xAccntParents: [];
};

type AmazonAlbumsResponse = {
  count: number;
  data: AmazonAlbum[];
};

export { AmazonAlbumsResponse, AmazonAlbum };
