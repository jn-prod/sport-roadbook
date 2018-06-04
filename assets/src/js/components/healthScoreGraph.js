import Chart from 'chart.js'

var ctx = document.getElementById('scoreHealthChart').getContext('2d')
var score = []
$('.score').each((key, val) => {
  score.push(val.value)
})

console.log(score)

var myChart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'horizontalBar',

  // The data for our dataset
  data: {
    labels: ['humeur', 'sommeil', 'lassitude', 'recuperation', 'stress'],
    datasets: [{
      label: 'Score',
      data: score,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
})

export default myChart
