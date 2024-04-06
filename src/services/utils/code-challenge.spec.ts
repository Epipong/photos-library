import {
  computeCodeChallengeFromVerifier,
  generateRandomBase64String,
  isCodeVerifierValid,
} from "./code-challenge";

describe("Code Challenge", () => {
  describe("generateRandomBase64String", () => {
    it("should generate a random value of length 32.", async () => {
      const value = await generateRandomBase64String(24);
      expect(value.length).toEqual(32);
    });
  });

  describe("isCodeVerifierValid", () => {
    it("should be true.", async () => {
      const codeVerifier = await generateRandomBase64String(24);
      const codeChallenge =
        await computeCodeChallengeFromVerifier(codeVerifier);
      const result = await isCodeVerifierValid(codeVerifier, codeChallenge);
      expect(result).toEqual(true);
    });
  });
});
