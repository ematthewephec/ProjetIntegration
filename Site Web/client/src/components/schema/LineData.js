import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Line } from 'react-chartjs-2'

const linedatas = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [1500000, 3900000, 3000000, 4100000, 2300000, 1800000, 2000000]
    }
  ]
}

// const myRef = React.createRef();
const lineOptions = {
  onClick: (e, element) => {
    if (element.length > 0) {
      const ind = element[0]._index
      console.log(ind)
    }
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false
        },
        ticks: {
          beginAtZero: true,
          userCallback (value) {
            value = value.toString()
            value = value.split(/(?=(?:...)*$)/)
            value = value.join('.')
            return `Rp.${value}`
          }
        }
      }
    ]
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  }
}

function LineData () {
  return (
    <Grid item xs={12}>
      <Paper>
        <Line data={linedatas} option={lineOptions} />
      </Paper>
    </Grid>
  )
}

export default LineData
