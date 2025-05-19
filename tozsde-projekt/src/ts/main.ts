import '../scss/style.scss';
import Chart, { ChartItem } from 'chart.js/auto'
import ChartTimeOject from './ChartTimeObject';

const ctx = document.getElementById('mainGraph') as ChartItem;

const testData: ChartTimeOject[] = [
    {time:0, value:10},
    {time:1, value:20},
    {time:2, value:10},
    {time:3, value:90},
    {time:4, value:40},
    {time:5, value:2}
]

new Chart(ctx, {
    type: 'line',
    data: {
        labels: testData.map(row => row.time),
        datasets: [
          {
            data: testData.map(row => row.value)
          }
        ]
      }
  });

//   new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//       datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });