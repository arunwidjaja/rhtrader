import * as dotenv from 'dotenv'
import * as path from 'path'

import { decodeBase64, encodeBase64 } from 'tweetnacl-util';
import { sign } from 'tweetnacl';

export function printThis(printThis: string): void {
    console.log(printThis)
}

/**
 * Initializes a connection with Robinhood account.
 * 
 * Contains basic functions for placing crypto trades and viewing crypto account information
 */
export class RobinHoodCryptoTrader {
    private apiKey: string;
    private privateKeyBase64: string;
    private privateKey: Uint8Array;
  
    private baseUrl: string = "https://trading.robinhood.com"
  
    constructor() {
      // Get env keys
      dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
      this.apiKey = process.env.RH_API_KEY ?? ""
      this.privateKeyBase64 = process.env.RH_PRIVATE_KEY ?? ""
  
      // Generate private key
      const secretKey = decodeBase64(this.privateKeyBase64)
      const keyPair = sign.keyPair.fromSecretKey(secretKey);
      this.privateKey = keyPair.secretKey;
    }
  
    get_timestamp(): number {
      // const timestamp = Math.floor(Date.now() / 1000);
      const timestamp = Math.floor(Date.now() / 1000)
      // console.log("Local timestamp generated:", timestamp)
      // console.log("Human readable UTC time:", new Date(timestamp * 1000).toUTCString())
      return timestamp
    }
  
    get_query_params(key: string, args?: string[]): string {
      const params = []
      if (!args) {
        return ""
      } else {
        for (const arg of args) {
          params.push(key + "=" + arg)
        }
      }
      return ("?" + params.join("&"))
    }
  
    get_authorization_header(method: string, path: string, body: string, timestamp: number): Record<string, string> {
      const messageToSign = (this.apiKey + timestamp + path + method + body)
      const messageUint8 = new TextEncoder().encode(messageToSign)
      const signed = sign.detached(messageUint8, this.privateKey)
      return {
        "x-api-key": this.apiKey,
        "x-signature": encodeBase64(signed),
        "x-timestamp": timestamp.toString(),
      }
    }
  
    async make_api_request(method: string, path: string, body: string = "") {
      const start = Date.now()
      const timestamp = this.get_timestamp()
      // console.log("The timestamp for this request is: " + timestamp)
      const headers = {
        ...this.get_authorization_header(method, path, body, timestamp),
        "Content-Type": "application/json"
      }
      const url = this.baseUrl + path
  
      let response: Response;
      try {
        if (method === "GET") {
          response = await fetch(url, {
            method: method,
            headers: headers,
          })
        } else {
          response = await fetch(url, {
            method: method,
            headers: headers,
            body: body
          })
        }
        const end = Date.now()
        const timeTaken = end - start
        const responseText = await response.text()
  
        // console.log(`Server took ${timeTaken}ms to respond`)
        // console.log("Response status: " + response.status)
        // console.log("Response time: " + response.headers.get('date'))
        // console.dir("Request URL: " + url)
        // console.dir("Request headers: " + headers)
        // console.dir("Request body: " + body)
  
        return responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        console.log("There was an error making the API request: " + error)
      }
    }
  
    get_account(): Promise<any> {
      const path = "/api/v1/crypto/trading/accounts/"
      return this.make_api_request("GET", path)
    }
  
    /**
     * Gets information about crypto holdings
     * @param asset_codes - List of currency tickers. If blank, gets information about all.
     */
    get_holdings(asset_codes?: string[]): Promise<any> {
      const holdingsPath = "/api/v1/crypto/trading/holdings/"
      let query_params: string;
      if (asset_codes) {
        query_params = this.get_query_params(this.apiKey, asset_codes)
      } else {
        query_params = this.get_query_params(this.apiKey)
      }
  
      const path = holdingsPath + query_params
      // console.log("Sending request: GET holdings...")
      return this.make_api_request("GET", path)
    }
  
    get_trading_pairs(symbols?: string[]): Promise<any> {
      const query_params = this.get_query_params("symbol", symbols)
      const path = ("/api/v1/crypto/trading/trading_pairs/" + { query_params })
      return this.make_api_request("GET", path)
    }
  
    get_best_bid_ask(symbols?: string[]): Promise<any> {
      const query_params = this.get_query_params("symbol", symbols)
      const path = ("/api/v1/crypto/trading/best_bid_ask/" + { query_params })
      return this.make_api_request("GET", path)
    }
  
    get_estimated_price(symbol: string, side: string, quanitity: string): Promise<any> {
      const path = ("/api/v1/crypto/marketdata/estimated_price/?symbol=" + symbol + "&side=" + side + "&quantity=" + quanitity)
      return this.make_api_request("GET", path)
    }
  
    place_order(
      client_order_id: string,
      side: string,
      order_type: string,
      symbol: string,
      order_config: Record<string, string>
    ): Promise<any> {
      const path = "/api/v1/crypto/trading/orders/"
      const body = {
        "client_order_id": client_order_id,
        "side": side,
        "type": order_type,
        "symbol": symbol,
        [order_type + "_order_config"]: order_config
      }
      return this.make_api_request("POST", path, JSON.stringify(body))
    }
  
    cancel_order(order_id: string): Promise<any> {
      const path = ("/api/v1/crypto/trading/orders/" + order_id + "/cancel/")
      return this.make_api_request("POST", path)
    }
  
    get_order(order_id: string): Promise<any> {
      const path = ("/api/v1/crypto/trading/orders/" + order_id + "/")
      return this.make_api_request("GET", path)
    }
  
    get_orders(): Promise<any> {
      const path = "/api/v1/crypto/trading/orders/"
      return this.make_api_request("GET", path)
    }
  }