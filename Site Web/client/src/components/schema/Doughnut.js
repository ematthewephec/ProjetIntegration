import React from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Doughnut } from 'react-chartjs-2'

const data = {
  maintainAspectRatio: false,
  responsive: false,
  labels: ['a', 'b', 'c', 'd'],
  datasets: [
    {
      data: [300, 50, 100, 50],
      backgroundColor: 'rgba(203, 197, 11, 1)',
      hoverBackgroundColor: 'rgba(203, 197, 11, 1)'
    }
  ]
}

const options = {
  legend: {
    display: false,
    position: 'right'
  },
  elements: {
    arc: {
      borderWidth: 0
    }
  }
}

function Doughnuts () {
  return (
    <Grid item xs={12}>
      <Paper>
        <Doughnut data={data} options={options} />
      </Paper>
    </Grid>
  )
}

export default Doughnuts
