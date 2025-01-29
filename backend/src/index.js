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
var dotenv = require("dotenv");
var path = require("path");
var tweetnacl_1 = require("tweetnacl");
var tweetnacl_util_1 = require("tweetnacl-util");
// console.log('naclUtil:', naclUtil)
var CryptoTrader = /** @class */ (function () {
    function CryptoTrader() {
        var _a, _b;
        this.baseUrl = "https://trading.robinhood.com";
        // Get env keys
        dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
        this.apiKey = (_a = process.env.RH_API_KEY) !== null && _a !== void 0 ? _a : "";
        this.privateKeyBase64 = (_b = process.env.RH_PRIVATE_KEY) !== null && _b !== void 0 ? _b : "";
        // Generate private key
        var secretKey = (0, tweetnacl_util_1.decodeBase64)(this.privateKeyBase64);
        var keyPair = tweetnacl_1.sign.keyPair.fromSecretKey(secretKey);
        this.privateKey = keyPair.secretKey;
    }
    CryptoTrader.prototype.get_timestamp = function () {
        // const timestamp = Math.floor(Date.now() / 1000);
        var timestamp = Math.floor(Date.now() / 1000);
        console.log("Local timestamp generated:", timestamp);
        console.log("Human readable UTC time:", new Date(timestamp * 1000).toUTCString());
        return timestamp;
    };
    CryptoTrader.prototype.get_query_params = function (key, args) {
        var params = [];
        if (!args) {
            return "";
        }
        else {
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var arg = args_1[_i];
                params.push(key + "=" + arg);
            }
        }
        return ("?" + params.join("&"));
    };
    CryptoTrader.prototype.get_headers = function (method, path, body, timestamp) {
        var messageToSign = (this.apiKey + timestamp + path + method + body);
        var messageUint8 = new TextEncoder().encode(messageToSign);
        var signed = tweetnacl_1.sign.detached(messageUint8, this.privateKey);
        return {
            "x-api-key": this.apiKey,
            "x-signature": (0, tweetnacl_util_1.encodeBase64)(signed),
            "x-timestamp": timestamp.toString(),
        };
    };
    CryptoTrader.prototype.make_api_request = function (method_1, path_1) {
        return __awaiter(this, arguments, void 0, function (method, path, body) {
            var start, timestamp, headers, url, response, end, timeTaken, responseText, error_1;
            if (body === void 0) { body = ""; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = Date.now();
                        timestamp = this.get_timestamp();
                        console.log("The timestamp for this request is: " + timestamp);
                        headers = this.get_headers(method, path, body, timestamp);
                        url = this.baseUrl + path;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        if (!(method === "GET")) return [3 /*break*/, 3];
                        console.log("Sending GET request...");
                        return [4 /*yield*/, fetch(url, {
                                method: method,
                                headers: headers,
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, fetch(url, {
                            method: method,
                            headers: headers,
                            body: body
                        })];
                    case 4:
                        response = _a.sent();
                        _a.label = 5;
                    case 5:
                        end = Date.now();
                        timeTaken = end - start;
                        return [4 /*yield*/, response.text()];
                    case 6:
                        responseText = _a.sent();
                        console.log("Server took ".concat(timeTaken, "ms to respond"));
                        console.log("Response status: " + response.status);
                        console.log("Response time: " + response.headers.get('date'));
                        return [2 /*return*/, responseText ? JSON.parse(responseText) : null];
                    case 7:
                        error_1 = _a.sent();
                        console.log("There was an error making the API request: " + error_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CryptoTrader.prototype.get_account = function () {
        var path = "/api/v1/crypto/trading/accounts/";
        return this.make_api_request("GET", path);
    };
    /**
     * Gets information about crypto holdings
     * @param asset_codes - List of currency tickers. If blank, gets information about all.
     */
    CryptoTrader.prototype.get_holdings = function (asset_codes) {
        var holdingsPath = "/api/v1/crypto/trading/holdings/";
        var query_params;
        if (asset_codes) {
            query_params = this.get_query_params(this.apiKey, asset_codes);
        }
        else {
            query_params = this.get_query_params(this.apiKey);
        }
        var path = holdingsPath + query_params;
        console.log("Sending request: GET holdings...");
        return this.make_api_request("GET", path);
    };
    CryptoTrader.prototype.get_trading_pairs = function (symbols) {
        var query_params = this.get_query_params("symbol", symbols);
        var path = ("/api/v1/crypto/trading/trading_pairs/" + { query_params: query_params });
        return this.make_api_request("GET", path);
    };
    CryptoTrader.prototype.get_best_bid_ask = function (symbols) {
        var query_params = this.get_query_params("symbol", symbols);
        var path = ("/api/v1/crypto/trading/best_bid_ask/" + { query_params: query_params });
        return this.make_api_request("GET", path);
    };
    CryptoTrader.prototype.get_estimated_price = function (symbol, side, quanitity) {
        var path = ("/api/v1/crypto/marketdata/estimated_price/?symbol=" + symbol + "&side=" + side + "&quantity=" + quanitity);
        return this.make_api_request("GET", path);
    };
    CryptoTrader.prototype.place_order = function (client_order_id, side, order_type, symbol, order_config) {
        var _a;
        var path = "/api/v1/crypto/trading/orders/";
        var body = (_a = {
                "client_order_id": client_order_id,
                "side": side,
                "type": order_type,
                "symbol": symbol
            },
            _a[order_type + "_order_conrfig"] = order_config,
            _a);
        return this.make_api_request("POST", path, JSON.stringify(body));
    };
    CryptoTrader.prototype.cancel_order = function (order_id) {
        var path = ("/api/v1/crypto/trading/orders/" + order_id + "/cancel/");
        return this.make_api_request("POST", path);
    };
    CryptoTrader.prototype.get_order = function (order_id) {
        var path = ("/api/v1/crypto/trading/orders/" + order_id + "/");
        return this.make_api_request("GET", path);
    };
    CryptoTrader.prototype.get_orders = function () {
        var path = "/api/v1/crypto/trading/orders/";
        return this.make_api_request("GET", path);
    };
    return CryptoTrader;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rh, account, holdings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rh = new CryptoTrader();
                    return [4 /*yield*/, rh.get_account()];
                case 1:
                    account = _a.sent();
                    console.log("Created connection to account: " + account);
                    return [4 /*yield*/, rh.get_holdings(['ETH', 'BTC'])];
                case 2:
                    holdings = _a.sent();
                    console.log("My crypto holdings:");
                    console.log(holdings);
                    rh.get_holdings();
                    return [2 /*return*/];
            }
        });
    });
}
main();
