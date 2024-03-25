interface AuthProvider {
  init: () => Promise<void>;
  token: () => Promise<string>;
  refresh: () => Promise<void>;
}

export { AuthProvider }