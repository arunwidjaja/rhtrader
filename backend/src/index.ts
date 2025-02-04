import * as _ from 'lodash'
import * as readline from 'readline'
import { v4 as uuidv4 } from 'uuid'

import { RobinHoodCryptoTrader } from './robinhood';
import { CapitolTradesScraper } from './capitolTradesScraper';
import { etraderSandbox } from './etrade';

/**
 * Testing the CapitolTrades.com scraper and the RobinHood API.
 * This just uses dummy logic. It buys/trades crypto based on whether the given congress member bought/sold stock.
 * 
 * @param baseEthAmount The amount of ETH to trade per transaction. Pick a small number.
 * @param capitolTradesID The politician to track.
 */
async function rhAndScraperTest(): Promise<void> {
  const ethAmount = 0.0001
  const pid = "P000197"

  const rh = new RobinHoodCryptoTrader()
  const account = await rh.get_account()
  console.log(`Successfully connected to your Robinhood Account!`)

  const holdings = await rh.get_holdings(['ETH'])
  console.log(`Your account currently holds ${holdings.results[0].total_quantity} ETH.`)

  const scraper = new CapitolTradesScraper()
  const recentTrades = await scraper.get_trades(pid)

  console.log(`Recent (2025) Trades for Politician ${pid}:`)
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

/**
 * Testing the E*TRADE API.
 */
async function etradeTest() {
  const etrader = new etraderSandbox()
  await etrader.authorize()
  await etrader.completeAuthorization()
}

async function main() {
  // await rhAndScraperTest()
  await etradeTest()
}


main()



