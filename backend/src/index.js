"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var robinhood_1 = require("./robinhood");
var capitolTradesScraper_1 = require("./capitolTradesScraper");
var etrade_1 = require("./etrade");
/**
 * Testing the CapitolTrades.com scraper and the RobinHood API.
 * This just uses dummy logic. It buys/trades crypto based on whether the given congress member bought/sold stock.
 *
 * @param baseEthAmount The amount of ETH to trade per transaction. Pick a small number.
 * @param capitolTradesID The politician to track.
 */
function rhAndScraperTest() {
    return __awaiter(this, void 0, void 0, function () {
        var ethAmount, pid, rh, account, holdings, scraper, recentTrades, _i, recentTrades_1, trade, size, multiplier, order_id, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ethAmount = 0.0001;
                    pid = "P000197";
                    rh = new robinhood_1.RobinHoodCryptoTrader();
                    return [4 /*yield*/, rh.get_account()];
                case 1:
                    account = _a.sent();
                    console.log("Successfully connected to your Robinhood Account!");
                    return [4 /*yield*/, rh.get_holdings(['ETH'])];
                case 2:
                    holdings = _a.sent();
                    console.log("Your account currently holds ".concat(holdings.results[0].total_quantity, " ETH."));
                    scraper = new capitolTradesScraper_1.CapitolTradesScraper();
                    return [4 /*yield*/, scraper.get_trades(pid)];
                case 3:
                    recentTrades = _a.sent();
                    console.log("Recent (2025) Trades for Politician ".concat(pid, ":"));
                    console.dir(recentTrades);
                    console.log("For demo purposes, buy/sell orders will be executed on crypto instead of stock.");
                    console.log("The size of the order will determined by the size of the reported trade. ");
                    console.log("There are only three sizes of trades, corresponding to 1x, 2x, and 3x orders.");
                    _i = 0, recentTrades_1 = recentTrades;
                    _a.label = 4;
                case 4:
                    if (!(_i < recentTrades_1.length)) return [3 /*break*/, 7];
                    trade = recentTrades_1[_i];
                    size = trade.size;
                    multiplier = void 0;
                    if (size.includes("1M")) {
                        multiplier = 3;
                    }
                    else if (size.includes("500K")) {
                        multiplier = 2;
                    }
                    else {
                        multiplier = 1;
                    }
                    console.log("Opening a ".concat(trade.action, " order for ").concat(multiplier * ethAmount, " ETH..."));
                    order_id = (0, uuid_1.v4)();
                    return [4 /*yield*/, rh.place_order(order_id, "".concat(trade.action), "market", "ETH-USD", { "asset_quantity": "".concat(ethAmount * multiplier) })];
                case 5:
                    response = _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Testing the E*TRADE API.
 */
function etradeTest() {
    return __awaiter(this, void 0, void 0, function () {
        var etrader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    etrader = new etrade_1.etraderSandbox();
                    return [4 /*yield*/, etrader.authorize()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, etrader.completeAuthorization()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // await rhAndScraperTest()
                return [4 /*yield*/, etradeTest()];
                case 1:
                    // await rhAndScraperTest()
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
