interface AuthProvider {
  init: () => Promise<void>;
  refresh: () => Promise<void>;
  token: () => Promise<string>;
}

export { AuthProvider }