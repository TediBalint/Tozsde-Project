import '../scss/style.scss';
import Chart, { ChartItem } from 'chart.js/auto'
import ChartTimeObject from './ChartTimeObject';

const ctx = document.getElementById('mainGraph') as ChartItem;
let ws: WebSocket
const username = (document.querySelector("#username") as HTMLInputElement)
const Password = (document.querySelector("#pwd") as HTMLInputElement)

const connection = () => {
  ws = new WebSocket('ws://localhost:8081');
  ws.onopen = () => {
    console.log('Connected to server');
  }
  ws.onclose = (reason) => {
    console.log(reason);
    console.log('Disconnected from server');
  }
}
window.onload = connection;
(document.querySelector("#loginBtn") as HTMLButtonElement).addEventListener("click", () => {
  login();
})
let loggedIn = false
window.addEventListener("keydown", (e)=>{
  if(e.key == "Enter" && !loggedIn)
    login()
})
let stocksNames;
let currentStock = "---";
const stockButtons = (document.querySelector("#stockSelector") as HTMLElement)

const updateStockButtons = () => {
  stockButtons.innerHTML = ""
  for (let stock of stocksNames) {
    let btn = document.createElement("button")
    btn.textContent = stock;
    btn.classList.add("btn")
    if (stock == currentStock) {
      btn.classList.add("selectedStock")
    }
    btn.addEventListener("click", (e) => {
      currentStock = (e.target as HTMLButtonElement).textContent as string
      askForStockData(currentStock)
      updateStockButtons();
    });
    stockButtons.appendChild(btn)
  }
}

let globalUser

const login = () => {
  const user = username.value;
  globalUser = user
  const pass = Password.value;
  ws.send(JSON.stringify({ type: "login", user, pass }));
  ws.onmessage = (event) => onMessage(event, user)
}
let chart: Chart;
const onMessage = (event, user) => {
  const data = JSON.parse(event.data);
  if (data.type == "login") {
    if (data.success) {
      (document.querySelector('#usrnm') as HTMLElement).textContent = user;
      (document.querySelector('#userStockCount') as HTMLElement).textContent = data.balance;
      (document.querySelector("#trading") as HTMLElement).style.display = "block";
      (document.querySelector("#login") as HTMLElement).style.display = "none";
      loggedIn = true
    }
    else {
      alert("Hibás felhasználónév vagy jelszó!");
    }
  }
  else if (data.type == "stockList") {
    stocksNames = data.Names
    if (currentStock == "---") currentStock = stocksNames[0];
    updateStockButtons();
    askForStockData(currentStock)
  }

  else if (data.type.includes("graph")) {    
    let rawData = data.CostData
    let stockName = data.Name
    if (currentStock == stockName) {
      try { chart.destroy() } catch { }
      let chartData: ChartTimeObject[] = []
      for (let i = 0; i < rawData.length; i++) {
        chartData.push({
          time: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
          value: rawData[i]
        })
      }
      let slicedDatasets: Array<any> = []
      for (let i = 0; i < chartData.length - 1; i++) {
        let tempData = chartData.slice(i, i + 2).map(row => row.value)
        for (let j = 0; j < i; j++) tempData.unshift(NaN)
        slicedDatasets.push(
          {
            borderColor: chartData[i].value < chartData[i + 1].value ? "#40db69" : (chartData[i].value > chartData[i + 1].value ? "#e69e19" : "#aaa"),
            data: tempData
          }
        )
      }
      chart = new Chart(ctx, {
        type: 'line',
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          elements: {
            point: {
              radius: 2
            }
          },
          animation: {
            duration: 0
          }
        },
        data: {
          labels: chartData.map(row => row.time),
          datasets: slicedDatasets
        }
      })
    }
  }
  else if (data.type == "buy"){
    console.log("bought");
    
  }
};
(document.querySelector("#buyStock") as HTMLButtonElement).addEventListener("click", () => {  
  let _amount :Number = Number((document.querySelector("#buyAmount") as HTMLInputElement).value)
  ws.send(JSON.stringify({type: "stock", action: "buy", amount: _amount, stock: currentStock, user: globalUser}))
});
(document.querySelector("#sellStock") as HTMLButtonElement).addEventListener("click", () => {
  let _amount = (document.querySelector("#sellAmount") as HTMLInputElement).value
  ws.send(JSON.stringify({type: "stock", action: "sell", amount: _amount, stock: currentStock, user: globalUser}))
});
(document.querySelector("#setNotifButton") as HTMLButtonElement).addEventListener("click", () => {
  let _goal = (document.querySelector("#notifValue") as HTMLInputElement).value
  let _above: boolean = (document.querySelector("#aboveSelector") as HTMLSelectElement).value == "1"
  ws.send(JSON.stringify({type: "stock", action: "sell", goal: _goal, above: _above, stock: currentStock, user: globalUser}))
})

const askForStockData = async (stockName: string) => {
  while(currentStock == stockName) {
    ws.send(JSON.stringify({ type: "stock", action:"getData", stock: stockName }));
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
};