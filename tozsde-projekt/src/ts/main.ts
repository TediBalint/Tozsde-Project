import '../scss/style.scss';
import Chart, { ChartItem } from 'chart.js/auto'
import ChartTimeOject from './ChartTimeObject';

const ctx = document.getElementById('mainGraph') as ChartItem;
let ws: WebSocket

const connection = () =>{
    ws = new WebSocket('ws://localhost:8081');
    ws.onopen = () =>{
        console.log('Connected to server');
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

for(let stock of stocksNames){
  let btn = document.createElement("button")
  btn.textContent = stock;
  if (stock == stocksNames[0]){
    btn.classList.add("selectedStock")
  }
  btn.addEventListener("click", ()=>{
    

  });
  (document.querySelector("#stockSelector") as HTMLElement).appendChild(btn)

}