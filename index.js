require('dotenv').config();
var oauth = require('oauth');

var config =
{
  api_url: process.env.API_URL,
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_secret: process.env.ACCESS_SECRET
};

var tradeking_consumer = new oauth.OAuth
(
  "https://developers.tradeking.com/oauth/request_token",
  "https://developers.tradeking.com/oauth/access_token",
  config.consumer_key,
  config.consumer_secret,
  "1.0",
  null,
  "HMAC-SHA1"
);

tradeking_consumer.get(config.api_url + '/accounts.json', config.access_token, config.access_secret, function (err, data, res) {
    acct_data = JSON.parse(data);
    console.log('acct_data: ' + JSON.stringify(acct_data.response)); });
