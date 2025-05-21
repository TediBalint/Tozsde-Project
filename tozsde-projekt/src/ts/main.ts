import '../scss/style.scss';
import Chart, { ChartItem } from 'chart.js/auto'
import ChartTimeOject from './ChartTimeObject';

const ctx = document.getElementById('mainGraph') as ChartItem;
let ws: WebSocket


const connection = () =>{
  ws = new WebSocket('ws://localhost:8081');
  ws.onopen = () =>{
    console.log('Connected to server');
    updateStockButtons()
  }
  ws.onmessage = (event) =>{
    const data: ChartTimeOject[] = [ // teszt adatsor, majd ws küldi
      { time: 0, value: 10 },
      { time: 1, value: 20.5 },
      { time: 2, value: 10 },
      { time: 3, value: 50 },
      { time: 4, value: 65 },
      { time: 5, value: 30 },
      { time: 6, value: 30 }
    ];
    let slicedDatasets:Array<any> = []
    for (let i = 0; i < data.length - 1; i++) {
      let tempData = data.slice(i, i + 2).map(row => row.value)
      for(let j = 0; j < i; j++) tempData.unshift(NaN)
      slicedDatasets.push(
        {
          borderColor: data[i].value < data[i + 1].value ? "#40db69" : (data[i].value > data[i + 1].value ? "#e69e19" : "#aaa"), //data[i].value < data[i + 1].value ? "#40db69" : "#e69e19",
          data: tempData
        }
      )      
    }
    new Chart(ctx, {
      type: 'line',
      options:{
        plugins:{
          legend:{
            display:false
          }
        }
      },
      data:{
        labels: data.map(row => row.time), 
        datasets: slicedDatasets
      }
    })
    }
  ws.onclose = () =>{
    console.log('Disconnected from server');
  }
}
window.onload = connection;
(document.querySelector("#loginBtn") as HTMLButtonElement).addEventListener("click", ()=>{
  //login folyamatot majd a backendes megirja
  (document.querySelector("#login") as HTMLElement).style.display = "none";
  (document.querySelector("#trading") as HTMLElement).style.display = "block";
})
let stocksNames = ["nvidia", "coca cola", "example3"]; // nyilvan nem lesz statikus ez sem
let currentStock = stocksNames[0]

const stockButtons = (document.querySelector("#stockSelector") as HTMLElement)

const updateStockButtons = () =>{
  stockButtons.innerHTML = ""
  for(let stock of stocksNames){
    let btn = document.createElement("button")
    btn.textContent = stock;
    btn.classList.add("btn")
    if (stock == currentStock){
      btn.classList.add("selectedStock")
    }
    btn.addEventListener("click", (e)=>{
      currentStock = (e.target as HTMLButtonElement).textContent as string
      updateStockButtons()
    });
    stockButtons.appendChild(btn)
  }
}