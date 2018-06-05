import Chart from 'chart.js'

var domain = document.domain
var url = window.document.URL
var id = url.split('/')[url.split('/').length - 1]
var json

if (document.getElementById('scoreHealthChart')) {
  var ctx = document.getElementById('scoreHealthChart').getContext('2d')
  var myChart

  if (domain === 'localhost') {
    json = 'https://localhost:3000/health/data/' + id
  } else {
    json = 'https://www.feezeify.me/health/data/' + id
  }

  $.getJSON(json, (res) => {
    var healthScore = res
    var score = Object.values(healthScore.health_detail)
    var labels = Object.keys(healthScore.health_detail)

    myChart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'horizontalBar',

      // The data for our dataset
      data: {
        labels: labels,
        datasets: [{
          label: 'Score',
          data: score,
          backgroundColor: [
            'rgba(0, 180, 177, 0.5)',
            'rgba(0, 180, 177, 0.5)',
            'rgba(0, 180, 177, 0.5)',
            'rgba(0, 180, 177, 0.5)',
            'rgba(0, 180, 177, 0.5)'
          ],
          borderColor: [
            'rgba(0,144,142,1)',
            'rgba(0,144,142,1)',
            'rgba(0,144,142,1)',
            'rgba(0,144,142,1)',
            'rgba(0,144,142,1)'
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
  })
}

export default myChart
