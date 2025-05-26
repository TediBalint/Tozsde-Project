import { WebSocketServer } from "ws";
import ClientActions from "./ClientActions.js";
import Serverside from "./Serveractions.js";

const CurrentStock = "";

Serverside.server.on("connection", (socket) => {
  console.log("client connected");
  socket.on("message", (message) => {
    try {
      Serverside.UpdateStockList();
      Serverside.SimulateStocks(socket);
      const data = JSON.parse(message);
      let User = filterByName(Serverside.Userlist, data.user);
      if (data.type == "login") {
        if(ClientActions.Login(socket, User, data.pass))
          {Serverside.SendStockList(socket);}
      }
      if (data.type === "stock") {
        let stock = filterByName(Serverside.Stocklist, data.stock);
        CurrentStock = stock.name;
        if (!StockCheck(socket, stock)) {
          return;
        }
        if (data.action == "buy") {
          ClientActions.BuyStock(socket, User, stock, data.amount);
        }
        if (data.action == "sell") {
          ClientActions.SellStock(socket, User, stock, data.amount);
        }
        if (data.goal == "getData") {
          Serverside.SendStockData(socket, stock);
        }
      }
      if (data.action == "alarm") {
        ClientActions.SetAlarm(stock, data.goal, data.above);
      }
    } catch (e) {
      socket.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });
});

console.log("server started");

// npx nodemon index.js

// node index.js ->kész program

function filterByName(jsonObject, username) {
  return jsonObject.filter(function (jsonObject) {
    return jsonObject["Name"] == username;
  })[0];
}
