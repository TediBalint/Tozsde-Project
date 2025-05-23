import { WebSocketServer } from "ws";
import ClientActions from "./ClientActions.js";
import Serverside from "./Serveractions.js";;


Serverside.server.on("connection", (socket) => {
  socket.on("message", (message) => {
    Serverside.UpdateStockList(socket);
    Serverside.SimulateStocks(socket);
    try {
      const data = JSON.parse(message);
      let User = filterByName(Serverside.Userlist, data.user);
      if (data.type == "login") {
        ClientActions.Login(socket, User, data.pass);
      }
      if (data.type === "stock") {
        let stock = filterByName(Serverside.Stocklist, data.stock);
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
          setInterval(() => {
            Serverside.SendStockData(socket, stock);
          }, 10000);
        }
        if (data.action == "alarm") {
          ClientActions.SetAlarm(stock, data.goal);
        }
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