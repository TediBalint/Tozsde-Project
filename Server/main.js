const WebSocket = require('ws');
const { default: Stock } = require('./Stock');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
//connected
ws.on('message', function incoming(message) {
let answer = "";
switch (message) {
    case "buy":
        Stock.Buy();
        break;
    case "sell":
        Stock.Sell();
        break;
    case "GetCurrntPrice":
        answer = Stock.GetCurrentPrice().ToString();
        break;
}
ws.send(answer);
});

ws.on('close', function () {
//disconnect
});
});