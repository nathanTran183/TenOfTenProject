const Request  = require('request');
const Querystring  = require('querystring');

const api_version = 'v1.1';
const app_id = '1815163008751669';
const app_secret = '4991be61fb8316e8ce5cc22377c14c5d';
const me_endpoint_base_url = 'https://graph.accountkit.com/v1.1/me';
const token_exchange_base_url = 'https://graph.accountkit.com/v1.1/access_token';

module.exports.phoneForCode = function(code, done) {
    var app_access_token = ['AA', app_id, app_secret].join('|');
    var params = {
        grant_type: 'authorization_code',
        code: code,
        access_token: app_access_token
    };

    // exchange tokens
    var token_exchange_url = token_exchange_base_url + '?' + Querystring.stringify(params);
    Request.get({url: token_exchange_url, json: true}, function(err, resp, respBody) {
        if (err || respBody.error) {
            return done(err || respBody.error);
        }
        // get account details at /me endpoint
        var me_endpoint_url = me_endpoint_base_url + '?access_token=' + respBody.access_token;
        Request.get({url: me_endpoint_url, json:true }, function(err, resp, respBody) {

            if (err || respBody.error) {
                return done(err || respBody.error);
            }

            var result = {
                phone: respBody.phone.number,
            }
            done(null, result);
        });
    });
}
