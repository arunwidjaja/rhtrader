import * as dotenv from 'dotenv'
import * as path from 'path'
import { sign } from 'tweetnacl';
import { decodeBase64, encodeBase64 } from 'tweetnacl-util';
import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { ApifyClient } from 'apify-client';

class CryptoTrader {
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

class CapitolTradesScraper {
  private apiKey: string;
  private baseUrl: string = "https://www.capitoltrades.com/trades?politician="
  private actor: string = "saswave/capitol-trades-scraper"
  private client: ApifyClient;

  constructor() {
    dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
    this.apiKey = process.env.APIFY_TOKEN ?? ""
    this.client = new ApifyClient({
      token: this.apiKey
    })
  }

  async get_trades(politician: string): Promise<any[]> {
    const url = this.baseUrl + politician + "&txDate=90d"
    const input = {
      "start_url": url
    }
    const run = await this.client.actor(this.actor).call(input)
    const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
    // console.dir(items)


    let recentTrades: Record<string, unknown>[] = []
    for (const item of items) {
      if (item["traded"]) {
        const year = (item["traded"] as string).trim()
        if (year === "2025") {
          const trade = {
            ticker: item.traded_issuer_ticker,
            action: item.type,
            size: item.size
          }
          recentTrades.push(trade)
        }
      }
    }
    // console.dir(recentTrades)
    // console.log(`Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`)
    return recentTrades
  }
}

async function main(): Promise<void> {
  const ethAmount = 0.0001
  const rh = new CryptoTrader()
  const account = await rh.get_account()
  console.log(`Successfully connected to your Robinhood Account!`)

  const holdings = await rh.get_holdings(['ETH'])
  console.log(`Your account currently holds ${holdings.results[0].total_quantity} ETH.`)

  const scraper = new CapitolTradesScraper()
  // Nancy Pelosi ID on Capitol Trades: P000197
  const politicianID = "P000197"
  const recentTrades = await scraper.get_trades(politicianID)

  console.log(`Recent (2025) Trades for Politician ${politicianID}:`)
  console.dir(recentTrades)

  console.log("For demo purposes, buy/sell orders will be executed on crypto instead of stock.")
  console.log("The size of the order will determined by the size of the reported trade. ")
  console.log("There are only three sizes of trades, corresponding to 1x, 2x, and 3x orders.")

  for (const trade of recentTrades) {
    const size = trade.size as string
    let multiplier: number;
    if (size.includes("1M")) {
      multiplier = 3
    } else if (size.includes("500K")) {
      multiplier = 2
    } else {
      multiplier = 1
    }

    console.log(`Opening a ${trade.action} order for ${multiplier * ethAmount} ETH...`)

    const order_id: string = uuidv4();
    const response = await rh.place_order(
      order_id,
      `${trade.action}`,
      "market",
      "ETH-USD",
      { "asset_quantity": `${ethAmount * multiplier}` }
    )
  }
}

main()
