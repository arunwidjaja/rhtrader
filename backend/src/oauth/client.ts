import { OAuth } from "oauth";

export class eTradeOauth {
  private apiKey: string;
  private secretKey: string;
  private signatureMethod = "HMAC-SHA1";

  private version = "1.0";

  private baseURL: string;
  private tokenURL: string;
  private accessURL: string;
  private authorizeURL: string;

  private oauthClient: InstanceType<typeof OAuth>;

  constructor(config: Record<string, string>) {
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
    this.baseURL = config.baseURL;
    this.authorizeURL = config.authorizeURL;
    this.tokenURL = config.tokenURL;
    this.accessURL = config.accessURL;

    this.oauthClient = new OAuth(
      `${this.baseURL}${this.tokenURL}`,
      `${this.baseURL}${this.accessURL}`,
      this.apiKey,
      this.secretKey,
      this.version,
      null,
      this.signatureMethod
    )
  }

  requestToken(): Promise<{
    token: string;
    tokenSecret: string;
    authorizeURL: string;
    query: any;
  }> {
    console.log("Requesting a token...")
    return new Promise((resolve, reject) => {
      const extraParams = {
        'oauth_callback': 'oob'
      }
      this.oauthClient.getOAuthRequestToken(extraParams, (err, oauthToken, oauthTokenSecret, parsedQueryString) => {
        console.log('OAuth Response:', {
          error: err,
          token: oauthToken,
          tokenSecret: oauthTokenSecret?.slice(0,5) + '...',
          queryParams: parsedQueryString
        });

        if (err) {
          console.error('OAuth request token error:', err);
          return reject(new Error(`OAuth request failed: ${JSON.stringify(err)}`));
        }

        if (!oauthToken || !oauthTokenSecret) {
          return reject(new Error('OAuth tokens were not provided.'));
        }
        resolve({
          token: oauthToken,
          tokenSecret: oauthTokenSecret,
          authorizeURL: `${this.authorizeURL}?key=${this.apiKey}&token=${oauthToken}`,
          // authorizeURL: parsedQueryString.login_url,
          query: parsedQueryString,
        });
      });
    });
  }

  accessToken(token: string, tokenSecret: string, verifier: string): Promise<{
    token: string;
    tokenSecret: string;
    query: any;
  }> {
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthAccessToken(
        token,
        tokenSecret,
        verifier,
        (err, accessToken, accessTokenSecret, parsedQueryString) => {
          if (err) {
            return reject(err);
          }
          resolve({
            token: accessToken,
            tokenSecret: accessTokenSecret,
            query: parsedQueryString,
          });
        }
      );
    });
  }

  get(url: string, token: string, tokenSecret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oauthClient.get(url, token, tokenSecret, (err, data, response) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  post(url: string, token: string, tokenSecret: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.oauthClient.post(url, token, tokenSecret, body, 'application/json', (err, data, response) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }
}
