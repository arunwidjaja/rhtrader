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
exports.etraderSandbox = void 0;
var dotenv = require("dotenv");
var path = require("path");
var url = require("node:url");
var readline = require("readline");
var client_1 = require("./oauth/client");
var etraderSandbox = /** @class */ (function () {
    function etraderSandbox() {
        var _a, _b;
        dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
        this.sandboxKey = (_a = process.env.ET_SANDBOX_API_KEY) !== null && _a !== void 0 ? _a : "";
        this.secretKey = (_b = process.env.ET_SECRET_KEY) !== null && _b !== void 0 ? _b : "";
        this.oauthAuthorizeURL = "https://us.etrade.com/e/t/etws/authorize";
        this.oauthAccessURL = "/oauth/access_token";
        this.oauthTokenURL = "/oauth/request_token";
        this.baseUrl = "https://apisb.etrade.com";
        var oauthConfig = {
            apiKey: this.sandboxKey,
            secretKey: this.secretKey,
            baseURL: this.baseUrl,
            authorizeURL: this.oauthAuthorizeURL,
            tokenURL: this.oauthTokenURL,
            accessURL: this.oauthAccessURL,
        };
        this.oAuthClient = new client_1.eTradeOauth(oauthConfig);
    }
    etraderSandbox.prototype.authorize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, token, tokenSecret, authorizeURL, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.oAuthClient.requestToken()];
                    case 1:
                        _a = _b.sent(), token = _a.token, tokenSecret = _a.tokenSecret, authorizeURL = _a.authorizeURL;
                        console.log("Visit the following URL to get your authorization code:");
                        console.log(authorizeURL);
                        this.tempToken = token;
                        this.tempTokenSecret = tokenSecret;
                        return [2 /*return*/, authorizeURL];
                    case 2:
                        error_1 = _b.sent();
                        console.log("Token Verification Failed: ", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    etraderSandbox.prototype.completeAuthorization = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rl, verificationCode, _a, token, tokenSecret, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.tempToken || !this.tempTokenSecret) {
                            throw new Error("No tokens found. Run authorize() first.");
                        }
                        rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                        return [4 /*yield*/, new Promise(function (resolve) {
                                rl.question('Enter your authentication code: ', function (code) {
                                    rl.close();
                                    resolve(code);
                                });
                            })];
                    case 1:
                        verificationCode = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.oAuthClient.accessToken(this.tempToken, this.tempTokenSecret, verificationCode)];
                    case 3:
                        _a = _b.sent(), token = _a.token, tokenSecret = _a.tokenSecret;
                        console.log("Successfully verified user!");
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        console.error("Verification Failed.", error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Helper method to check if user is authorized
     */
    etraderSandbox.prototype.isAuthorized = function () {
        return !!(this.accessToken && this.accessTokenSecret);
    };
    etraderSandbox.prototype.buildUrl = function (apiKey, secretKey, baseURL, path, pageOrQuery) {
        if (baseURL === null) {
            throw new Error('Must provide a base url');
        }
        if (path === null) {
            throw new Error('Must provide a path');
        }
        var query = (pageOrQuery && typeof pageOrQuery === 'object')
            ? pageOrQuery
            : {};
        if (apiKey && !secretKey) {
            query.api_key = apiKey;
        }
        return url.format({
            protocol: 'https:',
            hostname: baseURL,
            pathname: path,
            query: query,
        });
    };
    return etraderSandbox;
}());
exports.etraderSandbox = etraderSandbox;
function main() {
    var trader = new etraderSandbox();
}
main();
