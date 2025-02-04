import * as dotenv from 'dotenv'
import * as path from 'path'
import * as url from 'node:url'
import * as readline from 'readline'

import { eTradeOauth } from './oauth/client';

export class etraderSandbox {
    private sandboxKey: string;
    private secretKey: string;

    private baseUrl: string;

    private oauthAuthorizeURL: string;
    private oauthAccessURL: string;
    private oauthTokenURL: string;

    private oAuthClient: eTradeOauth;

    private accessToken?: string;
    private accessTokenSecret?: string;

    private tempToken?: string;
    private tempTokenSecret?: string;


    constructor() {
        dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
        this.sandboxKey = process.env.ET_SANDBOX_API_KEY ?? ""
        this.secretKey = process.env.ET_SECRET_KEY ?? ""

        this.oauthAuthorizeURL = "https://us.etrade.com/e/t/etws/authorize"

        this.oauthAccessURL = "/oauth/access_token"
        this.oauthTokenURL = "/oauth/request_token"

        this.baseUrl = "https://apisb.etrade.com"

        const oauthConfig = {
            apiKey: this.sandboxKey,
            secretKey: this.secretKey,
            baseURL: this.baseUrl,
            authorizeURL: this.oauthAuthorizeURL,
            tokenURL: this.oauthTokenURL,
            accessURL: this.oauthAccessURL,
        }

        this.oAuthClient = new eTradeOauth(oauthConfig)
    }

    async authorize(): Promise<string> {
        try {
            const { token, tokenSecret, authorizeURL } = await this.oAuthClient.requestToken();
            console.log("Visit the following URL to get your authorization code:")
            console.log(authorizeURL)

            this.tempToken = token;
            this.tempTokenSecret = tokenSecret;

            return authorizeURL;
        } catch (error) {
            console.log("Token Verification Failed: ", error)
            throw error;
        }
    }

    async completeAuthorization(): Promise<void> {
        if (!this.tempToken || !this.tempTokenSecret) {
            throw new Error("No tokens found. Run authorize() first.")
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const verificationCode = await new Promise<string>((resolve) => {
            rl.question('Enter your authentication code: ', (code) => {
                rl.close();
                resolve(code);
            })
        });
        try {
            const { token, tokenSecret } = await this.oAuthClient.accessToken(
                this.tempToken,
                this.tempTokenSecret,
                verificationCode
            )
            console.log("Successfully verified user!")
        } catch (error) {
            console.error("Verification Failed.", error);
            throw error;
        }
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
}

function main() {
    const trader = new etraderSandbox();
}
main()