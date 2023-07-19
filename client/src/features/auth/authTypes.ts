export interface User {
  username: string;
}

export interface authState {
  access_token: string | null;
  user: User | null;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
}
