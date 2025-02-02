"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eTradeOauth = void 0;
var oauth_1 = require("oauth");
var eTradeOauth = /** @class */ (function () {
    function eTradeOauth(config) {
        this.signatureMethod = "HMAC-SHA1";
        this.version = "1.0";
        this.apiKey = config.apiKey;
        this.secretKey = config.secretKey;
        this.baseURL = config.baseURL;
        this.authorizeURL = config.authorizeURL;
        this.tokenURL = config.tokenURL;
        this.accessURL = config.accessURL;
        this.oauthClient = new oauth_1.OAuth("".concat(this.baseURL).concat(this.tokenURL), "".concat(this.baseURL).concat(this.accessURL), this.apiKey, this.secretKey, this.version, null, this.signatureMethod);
    }
    eTradeOauth.prototype.requestToken = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var extraParams = {
                'oauth_callback': 'oob'
            };
            _this.oauthClient.getOAuthRequestToken(extraParams, function (err, oauthToken, oauthTokenSecret, parsedQueryString) {
                console.log('OAuth Response:', {
                    error: err,
                    token: oauthToken,
                    tokenSecret: (oauthTokenSecret === null || oauthTokenSecret === void 0 ? void 0 : oauthTokenSecret.slice(0, 5)) + '...',
                    queryParams: parsedQueryString
                });
                if (err) {
                    console.error('OAuth request token error:', err);
                    return reject(new Error("OAuth request failed: ".concat(JSON.stringify(err))));
                }
                if (!oauthToken || !oauthTokenSecret) {
                    return reject(new Error('OAuth tokens were not provided.'));
                }
                resolve({
                    token: oauthToken,
                    tokenSecret: oauthTokenSecret,
                    authorizeURL: "".concat(_this.authorizeURL, "?key=").concat(_this.apiKey, "&token=").concat(oauthToken),
                    query: parsedQueryString,
                });
            });
        });
    };
    eTradeOauth.prototype.accessToken = function (token, tokenSecret, verifier) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.oauthClient.getOAuthAccessToken(token, tokenSecret, verifier, function (err, accessToken, accessTokenSecret, parsedQueryString) {
                if (err) {
                    return reject(err);
                }
                resolve({
                    token: accessToken,
                    tokenSecret: accessTokenSecret,
                    query: parsedQueryString,
                });
            });
        });
    };
    eTradeOauth.prototype.get = function (url, token, tokenSecret) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.oauthClient.get(url, token, tokenSecret, function (err, data, response) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };
    eTradeOauth.prototype.post = function (url, token, tokenSecret, body) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.oauthClient.post(url, token, tokenSecret, body, 'application/json', function (err, data, response) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    };
    return eTradeOauth;
}());
exports.eTradeOauth = eTradeOauth;
