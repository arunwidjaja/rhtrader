import * as dotenv from 'dotenv'
import * as path from 'path'

import { eTradeOauth } from './oauth/client';
import url from 'node:url'

export class eTradeSandboxTrader {
    private sandboxKey: string;
    private secretKey: string;

    private baseUrl: string;

    private oauthAuthorizeUrl: string;
    private oauthAccessUrl: string;
    private oAuthTokenUrl: string;

    private oAuthClient: eTradeOauth;

    private accessToken?: string;
    private accessTokenSecret?: string;

    private tempToken?: string;
    private tempTokenSecret?: string;


    constructor() {
        dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
        this.sandboxKey = process.env.ET_SANDBOX_API_KEY ?? ""
        this.secretKey = process.env.ET_SECRETY_KEY ?? ""

        this.oauthAuthorizeUrl = "https://us.etrade.com/e/t/etws/authorize"
        this.oauthAccessUrl = "/oauth/access_token"
        this.oAuthTokenUrl = "/oauth/request_token"

        this.baseUrl = "https://apisb.etrade.com"

        const oauthConfig = {
            apiKey: this.sandboxKey,
            secretKey: this.secretKey,
            baseURL: this.baseUrl,
            authorizeURL: this.oauthAuthorizeUrl,
            tokenURL: this.oAuthTokenUrl,
            accessURL: this.oauthAccessUrl,
        }

        this.oAuthClient = new eTradeOauth(oauthConfig)
    }

    async authorize(): Promise<string> {
        const { token, tokenSecret, authorizeURL } = await this.oAuthClient.requestToken();
        console.log('Please visit:', authorizeURL);
        console.log('After authorization, you will receive a verification code.');

        this.tempToken = token;
        this.tempTokenSecret = tokenSecret;

        return authorizeURL;
    }

    async completeAuthorization(): Promise<void> {
        if (!this.tempToken || !this.tempTokenSecret) {
            throw new Error("No tokens found. Run authorize() first.")
        }
        const { token, tokenSecret } = await this.oAuthClient.accessToken(
            this.tempToken,
            this.tempTokenSecret,
            "Enter your verification code: "
        )
    }

    /**
     * Helper method to check if user is authorized
     */
    isAuthorized(): boolean {
        return !!(this.accessToken && this.accessTokenSecret);
    }

    buildUrl(
        apiKey: string,
        secretKey: string,
        baseURL: string,
        path: string,
        pageOrQuery?: Record<string, any>
    ) {
        if (baseURL === null) {
            throw new Error('Must provide a base url');
        }
        if (path === null) {
            throw new Error('Must provide a path');
        }
        const query: Record<string, any> = (pageOrQuery && typeof pageOrQuery === 'object')
            ? pageOrQuery
            : {};
        if (apiKey && !secretKey) {
            query.api_key = apiKey;
        }
        return url.format({
            protocol: 'https:',
            hostname: baseURL,
            pathname: path,
            query,
        });
    }

    // To see how to implement function calls look at the sample program provided by etrade
    // EtradeNodeClient -> oauth -> Client.js
    // Look at the Client.prototype.get/put/post/delete functions
    // URLs are built using the buildURL function in the same file.

    // Example method for making an authenticated API call

    async getAccountList(): Promise<any> {
        if (!this.isAuthorized()) {
            throw new Error('Not authorized. Please complete authorization flow first.');
        }

        const url = `${this.baseUrl}/v1/accounts/list`;
        return this.oAuthClient.get(url, this.accessToken!, this.accessTokenSecret!);
    }
}

function test() {
    const trader = new eTradeSandboxTrader();
}

function main() {
    test()
}
main()