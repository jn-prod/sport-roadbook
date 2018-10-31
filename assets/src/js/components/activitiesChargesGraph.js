import Chart from 'chart.js'

if (document.getElementById('healthScoreGraph')) {
  var ctx = document.getElementById('healthScoreGraph').getContext('2d')
  var labels = []
  var score = []

  $('input.activitiesWeek').each((key, val) => {
    labels.push(val.value)
    $(val).remove()
  })

  $('input.activitiesCharge').each((key, val) => {
    score.push(val.value)
    $(val).remove()
  })

  var myChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',
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
          'rgba(0, 180, 177, 0.5)',
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
          'rgba(0,144,142,1)',
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
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })
}

export default myChart
