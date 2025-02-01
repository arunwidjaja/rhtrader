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
exports.CapitolTradesScraper = void 0;
var dotenv = require("dotenv");
var path = require("path");
var apify_client_1 = require("apify-client");
var CapitolTradesScraper = /** @class */ (function () {
    function CapitolTradesScraper() {
        var _a;
        this.baseUrl = "https://www.capitoltrades.com/trades?politician=";
        this.actor = "saswave/capitol-trades-scraper";
        dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
        this.apiKey = (_a = process.env.APIFY_TOKEN) !== null && _a !== void 0 ? _a : "";
        this.client = new apify_client_1.ApifyClient({
            token: this.apiKey
        });
    }
    CapitolTradesScraper.prototype.get_trades = function (politician) {
        return __awaiter(this, void 0, void 0, function () {
            var url, input, run, items, recentTrades, _i, items_1, item, year, trade;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.baseUrl + politician + "&txDate=90d";
                        input = {
                            "start_url": url
                        };
                        return [4 /*yield*/, this.client.actor(this.actor).call(input)];
                    case 1:
                        run = _a.sent();
                        return [4 /*yield*/, this.client.dataset(run.defaultDatasetId).listItems()];
                    case 2:
                        items = (_a.sent()).items;
                        recentTrades = [];
                        for (_i = 0, items_1 = items; _i < items_1.length; _i++) {
                            item = items_1[_i];
                            if (item["traded"]) {
                                year = item["traded"].trim();
                                if (year === "2025") {
                                    trade = {
                                        ticker: item.traded_issuer_ticker,
                                        action: item.type,
                                        size: item.size
                                    };
                                    recentTrades.push(trade);
                                }
                            }
                        }
                        // console.dir(recentTrades)
                        // console.log(`Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`)
                        return [2 /*return*/, recentTrades];
                }
            });
        });
    };
    return CapitolTradesScraper;
}());
exports.CapitolTradesScraper = CapitolTradesScraper;
