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
    this.tokenURL = config.requestTokenURL;
    this.accessURL = config.accessTokenURL;

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
    return new Promise((resolve, reject) => {
      this.oauthClient.getOAuthRequestToken((err, oauthToken, oauthTokenSecret, parsedQueryString) => {
        if (err) {
          return reject(err);
        }
        resolve({
          token: oauthToken,
          tokenSecret: oauthTokenSecret,
          authorizeURL: `${this.authorizeURL}?key=${oauthToken}`,
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
