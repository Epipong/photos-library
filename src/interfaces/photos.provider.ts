interface PhotosProvider {
  main: ({
    title,
    source,
  }: {
    title?: string;
    source?: string;
  }) => Promise<void>;
}

export { PhotosProvider };
