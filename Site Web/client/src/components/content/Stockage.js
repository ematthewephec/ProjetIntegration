import React, { useEffect, useReducer, useContext, useRef } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Line } from 'react-chartjs-2'
import Axios from 'axios'
import { AppContext } from '../../Contexts/AppContext'
import Instruction from './instruction'

function useInterval (callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick () {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

function Stockage () {
  const context = useContext(AppContext)
  const [datas, setdatas] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'My First dataset',
          fill: true,
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
          data: [0, 0, 0]
        }
      ]
    }
  )

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
            display: true
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: true
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
      display: true
    },
    tooltips: {
      enabled: true
    }
  }
  console.log(context.storage)
  Axios.defaults.withCredentials = true
  useInterval(() => {
    // Your custom logic here
    context.readStorage()
    setdatas({
      // eslint-disable-next-line
      ["datasets"]: [
        {
          label: 'Batterie',
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,215,75,0.4)',
          borderColor: 'rgba(75,215,75,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,215,75,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 5,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: 'rgba(75,215,75,1)',
          pointHoverBorderColor: 'rgba(75,215,75,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 2,
          pointHitRadius: 15,
          data: context.storage.percent
        }
      ],
      // eslint-disable-next-line
      ["labels"]: context.storage.title
    })
  }, 5000)
  return (
    <Container>
      <Grid>
        <h1>Stockage</h1>
        {context.pcs &&
          <Line data={datas} option={lineOptions} />}
        {!context.pcs &&
          <Instruction />}
      </Grid>
    </Container>
  )
}

export default Stockage
