type GoogleRequestParams = {
  client_id: string;
  redirect_uri: string;
  response_type: "code";
  scope: string;
  code_challenge?: string;
  code_challenge_method?: "S256" | "plain";
  state?: string;
  login_hint?: string;
};

export { GoogleRequestParams };
