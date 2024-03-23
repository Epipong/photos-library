import { auth } from "./auth";

describe('auth', () => {
  describe('init', () => {
    it('should be true', () => {
      expect(auth).toBeTruthy();
    });
  });
});