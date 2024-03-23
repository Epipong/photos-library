const generateRandomBase64String = async (length = 24) =>
  Buffer.from(crypto.getRandomValues(new Uint8Array(length))).toString(
    'base64url'
  );

const computeCodeChallengeFromVerifier = async (verifier: string) => {
  const hashedValue = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(verifier)
  );
  return Buffer.from(hashedValue).toString('base64url');
};

const isCodeVerifierValid = async (codeVerifier: string, codeChallenge: string) => 
  (await computeCodeChallengeFromVerifier(codeVerifier)) === codeChallenge;

export { generateRandomBase64String, isCodeVerifierValid }