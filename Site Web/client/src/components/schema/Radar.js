import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Radar } from 'react-chartjs-2'

const RadarOptions = {
  scale: {
    ticks: {
      min: 0,
      max: 16,
      stepSize: 2,
      showLabelBackdrop: false,
      backdropColor: 'rgba(203, 197, 11, 1)'
    },
    angleLines: {
      color: 'rgba(255, 255, 255, .3)',
      lineWidth: 1
    },
    gridLines: {
      color: 'rgba(255, 255, 255, .3)',
      circular: true
    }
  }
}

const RadarData = {
  labels: ['Finger Strength', 'Power', 'Endurance', 'Stability', 'Flexability'],
  datasets: [
    {
      label: 'March',
      backgroundColor: 'rgba(34, 202, 236, .2)',
      borderColor: 'rgba(34, 202, 236, 1)',
      pointBackgroundColor: 'rgba(34, 202, 236, 1)',
      poingBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(34, 202, 236, 1)',
      data: [13, 10, 12, 6, 5]
    }
  ]
}

function Radars () {
  return (
    <Grid item xs={12}>
      <Paper>
        <Radar data={RadarData} options={RadarOptions} />
      </Paper>
    </Grid>
  )
}

export default Radars
