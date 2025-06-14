import { UpdateUserList, UpdateStockList } from "./Serveractions.js";

const AlarmList = [];

function Login(socket, user, pass) {
  if (user === undefined || user.Password !== pass) {
    socket.send(
      JSON.stringify({
        type: "login",
        success: false,
      })
    );
    return false;
  } else {
    socket.send(
      JSON.stringify({
        type: "login",
        success: true,
        user: user.Name,
        balance: user.Balance,
        usrStocks: user.Stocks,
      })
    );
    return true;
  }
}

function SetAlarm(stock, goal, above) {
  AlarmList.push({
    stock: stock,
    goal: goal,
    above: above
  });
}

function CheckAlarm(socket, stock) {
  AlarmList.forEach((alarm) => {
    if (alarm.stock.Name === stock.Name) {
      let currPrice = stock.CostData[stock.CostData.length - 1];
      if ((above && currPrice >= alarm.goal) || (!above && currPrice <= alarm.goal)) {
        socket.send(
          JSON.stringify({
            type: "alarm",
            message: `A ${stock.Name} átlépte a megadott limitet!`,
          })
        );
        AlarmList.splice(AlarmList.indexOf(alarm), 1);
      }
    }
  });
}

function StockCheck(socket, stock) {
  if (stock === undefined) {
    socket.send(
      JSON.stringify({
        type: "stock",
        message: "Not found",
      })
    );
    return;
  }
}

function SellStock(socket, user, stock, amount) {
  const Price = stock.CostData[stock.CostData.length - 1];
  let stockIndex = user.Stocks.findIndex((s) => s.Id === stock.Id);
    if (stock.Sell(amount)) {
      user.Balance += amount * Price;
      if (stockIndex == -1) {
        user.Stocks.push({
          Name: stock.Name,
          Amount: amount,
        });
        user.Stocks[stockIndex].Count += amount;
      }
    } else {
      socket.send(
        JSON.stringify({
          type: "sell",
          success: false,
        })
      );
      UpdateStockList(socket, stock);
      UpdateUserList(socket, user);
      return false;
    }
    socket.send(
      JSON.stringify({
        type: "sell",
        success: true,
        balance: user.Balance,
        stock: stock.Name,
        amount: amount,
      })
    );
    UpdateStockList(socket, stock);
    UpdateUserList(socket, user);
    return true;
}

function BuyStock(socket, user, stock, amount) {
  const Price = stock.CostData[stock.CostData.length - 1];
  let stockIndex = user.Stocks.findIndex((s) => s.Id == stock.Id);
    if (stock.Buy(amount)) {
      //kene ide if
      user.Balance -= amount * Price;
      if (stockIndex == -1) {
        user.Stocks.push({
          Name: stock.Name,
          Amount: amount,
        });
      } else {
        user.Stocks[stockIndex].Count += amount;
      }
    } else {
      socket.send(
        JSON.stringify({
          type: "buy",
          success: false,
        })
      );
      UpdateStockList(socket, stock);
      UpdateUserList(socket,user);
      return false;
  }

  socket.send(
    JSON.stringify({
      type: "buy",
      success: true,
      stock: stock.Name,
      amount: amount,
      balance: user.Balance,

    })
  );
   UpdateStockList(socket,stock);
   UpdateUserList(socket,user);
   return true;
}

export default {
  Login,
  BuyStock,
  SellStock,
  StockCheck,
  SetAlarm,
  CheckAlarm,
};