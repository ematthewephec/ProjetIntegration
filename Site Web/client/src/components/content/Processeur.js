import React, { useReducer, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Line } from 'react-chartjs-2'
import Axios from 'axios'

function Processeur () {
  let isRendered = useRef(false)
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
  Axios.defaults.withCredentials = true
  useEffect(() => {
    isRendered = true
    Axios.get(process.env.REACT_APP_API_URL + '/api/1/cpu', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      if (isRendered) {
        const data = response.data
        const title = []
        const percent = []
        for (const i of data) {
          title.push(i.test_date)
          percent.push(Number((i.cpu_percent)))
        }

        setdatas({
        // eslint-disable-next-line
        ["datasets"]: [
            {
              label: 'Processeur',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(192,75,192,0.4)',
              borderColor: 'rgba(192,75,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(192,75,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 5,
              pointHoverRadius: 10,
              pointHoverBackgroundColor: 'rgba(192,75,192,1)',
              pointHoverBorderColor: 'rgba(192,75,192,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 2,
              pointHitRadius: 15,
              data: percent
            }
          ],
          // eslint-disable-next-line
        ["labels"]: title
        })
      }
    }).catch(err => console.log(err))
    return () => {
      isRendered = false
    }
  }, [])
  return (
    <Container>
      <Grid>
        <h1>Processeur</h1>
        <Line data={datas} option={lineOptions} />
      </Grid>
    </Container>
  )
}

export default Processeur
