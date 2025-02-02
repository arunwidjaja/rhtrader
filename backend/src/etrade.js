"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eTradeTrader = void 0;
var dotenv = require("dotenv");
var path = require("path");
var eTradeTrader = /** @class */ (function () {
    function eTradeTrader() {
        var _a;
        dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
        this.apiKey = (_a = process.env.ET_API_KEY) !== null && _a !== void 0 ? _a : "";
        console.log("Successfully initialized eTrade trader.");
    }
    return eTradeTrader;
}());
exports.eTradeTrader = eTradeTrader;
function test() {
    var trader = new eTradeTrader();
}
function main() {
    test();
}
main();
