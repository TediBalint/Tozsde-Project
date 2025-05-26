import fs from "fs";
import { WebSocketServer } from "ws";
import Stock from "./Stock.js";
import { json } from "stream/consumers";

const server = new WebSocketServer({
  port: 8081,
  host: "localhost",
});

var Userlist = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
var Stocklist = JSON.parse(fs.readFileSync("./data/stocks.json", "utf8"));
console.log(Userlist);

function UpdateUserList(socket,user) {
      for (let i = 0; i < Userlist.length; i++) {
        if (Userlist[i].Id == user.Id) {
            Userlist.array[i] = user;
            break;
        }
    }
    fs.writeFile("./data/users.json", JSON.stringify(Userlist), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    socket.send(
        JSON.stringify({
            type: "userData",
            Balance: user.Balance,
        })
    );
}

function UpdateStockList(stock) {
    for (let i = 0; i < Stocklist.length; i++) {
        stock = Object.assign(new Stock(), Stocklist[i]); //mivel a fájlban csak a propertyk vannak mentve, a methodok elvesznének
        if (Stocklist[i].Id == stock.Id) {
            Stocklist[i] = stock;
        }
    }
    let json = JSON.stringify(Stocklist);
    
}

function SendStockList(socket){
    socket.send(
        JSON.stringify({
            type: "stockList",
            Names: Stocklist.map((stock) => stock.Name),
        })
    );
}

function SimulateStocks(socket) {
    setInterval(() => {
        Stocklist.forEach(stock => {
            stock.Step();
            UpdateStockList(socket,stock);
        });
    }, 30000);
}

function SendStockData(socket,stock) {
    socket.send(
        JSON.stringify({
            type: "stockData",
            CostData: stock.CostData,
            Name: stock.Name,
        })
    );
}

server.on("close", () => {});

server.on("error", (error) => {
  console.log(error.message);
});

export {UpdateStockList, UpdateUserList};
export default {server,Userlist, Stocklist,UpdateUserList, UpdateStockList, SimulateStocks, SendStockData};