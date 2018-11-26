require('dotenv').config();
var oauth = require('oauth');
var IEXClient = require('iex-api');
var fetch = require('isomorphic-fetch');

const iex = new IEXClient.IEXClient(fetch);
iex.stockChart('AAPL', 'date/20180831').then((data) => 
{
  var averages = [];
  var movingAverageShortLength = 5;
  var movingAverageLongLength = 30;
  var movingAverageShort = [];
  var movingAverageLong = [];
  var shortIsHigh = [];
  var runningProfit = 0, lastBought = 0, lastSold = 0;

  for (let minute in data)
  {
    averages.push(data[minute].average);
    
    // Short moving average
    if (minute === 0)
    {
      movingAverageShort.push(data[minute].average);
      movingAverageLong.push(data[minute].average);
    }
    else
    {
      let sum = 0;
      let count = 0;

      for (let i = minute; (i > minute - movingAverageShortLength) && (i >= 0); i--)
      {
        sum += data[i].average
        count++;
      }

      movingAverageShort.push(sum/count);

      sum = 0;
      count = 0;

      for (let i = minute; (i > minute - movingAverageLongLength) && (i >= 0); i--)
      {
        sum += data[i].average
        count++;
      }

      movingAverageLong.push(sum/count);

      shortIsHigh.push(movingAverageShort[minute] > movingAverageLong[minute])
    
      if (shortIsHigh.length > 1 && shortIsHigh[minute] != shortIsHigh[minute -1])
      {
        console.log("Average: " + averages[minute] + "\t\tS Mv Avg: " + movingAverageShort[minute] + "\t\tL Mv Avg: " + movingAverageLong[minute] + "\t\tshortIsHigh: " + shortIsHigh[minute]);
        if (shortIsHigh[minute]) 
        {
          console.log("--- BUYBUYBUY ---");
          lastBought = averages[minute];
        }
        else 
        {
          console.log("--- SELLSELLSELL ---");
          if (lastBought !== 0)
          {
            lastSold = averages[minute];
            runningProfit += lastSold - lastBought;
          }
        }
      }
    }
  }
  console.log("TOTALPROFITGUYS: " + runningProfit);

});

// Tradeking stuffs
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
    //console.log('acct_data: ' + JSON.stringify(acct_data.response));
});
