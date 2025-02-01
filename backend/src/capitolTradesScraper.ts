import * as dotenv from 'dotenv'
import * as path from 'path'
import { ApifyClient } from 'apify-client';

export class CapitolTradesScraper {
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