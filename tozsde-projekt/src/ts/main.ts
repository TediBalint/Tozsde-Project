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
    console.log(event);
const data = [ // teszt adatsor, majd ws küldi
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];
    new Chart(ctx, {
      type: 'line',
      data:{
        labels: data.map(row => row.year),
        datasets: [
          {
            // label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
      }
    })
  } // https://www.chartjs.org/docs/latest/getting-started/usage.html
   // https://stackoverflow.com/questions/52120036/chartjs-line-color-between-two-points
   //https://stackoverflow.com/questions/37204298/how-can-i-hide-dataset-labels-in-chart-js-v2
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