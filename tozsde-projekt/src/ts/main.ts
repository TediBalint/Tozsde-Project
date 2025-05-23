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
      ws.send("chart change trigger")
      updateStockButtons()
    });
    stockButtons.appendChild(btn)
  }
}

const login = () => {
  console.log("login");
  const user = username.value;
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
      console.log(data);
      (document.querySelector('#userStockCount') as HTMLElement).textContent = data.balance;
      (document.querySelector("#trading") as HTMLElement).style.display = "block";
      (document.querySelector("#login") as HTMLElement).style.display = "none";
    }
    else {
      // alert("Hibás felhasználónév vagy jelszó!");
      (document.querySelector("#trading") as HTMLElement).style.display = "block"; // teszt miatt
      (document.querySelector("#login") as HTMLElement).style.display = "none";
    }
  }
  else if (data.type == "stockList") {
    stocksNames = data.Names
    if (currentStock == "---") currentStock = stocksNames[0]
    updateStockButtons()

  }
  else if (data.type.includes("graph")) { //majd notificationt is ez kuldi
    let rawData = data.value.CostData.slice(-100)
    let stockName = data.value.Name
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
};
(document.querySelector("#setNotifButton") as HTMLButtonElement).addEventListener("click", () => {
  alert("asd")
})