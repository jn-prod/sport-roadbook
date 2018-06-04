import Chart from 'chart.js'

var ctx = document.getElementById('scoreHealthChart').getContext('2d')

var myChart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    type: 'horizontalBar',
    data: [
      {x: 'humeur', y: 1},
      {x: 'sommeil', y: 2},
      {x: 'lassitude', y: 3},
      {x: 'recuperation', y: 4},
      {x: 'stress', y: 5}
    ]
  }
})

export default myChart
