import React, { useEffect, useReducer, useRef } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { Radar } from 'react-chartjs-2'
import Axios from 'axios'

function Dashboard () {
  let isRendered = useRef(false)
  const [datas, setdatas] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      labels: ['Batterie', 'Processeur', 'Mémoire RAM', 'Stockage'],
      datasets: [
        {
          label: 'March',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
          data: [0, 0, 0, 0]
        }
      ]
    }
  )

  const RadarOptions = {
    scale: {
      ticks: {
        min: 0,
        max: 100,
        stepSize: 20,
        showLabelBackdrop: false,
        backdropColor: 'rgba(203, 197, 11, 1)'
      },
      angleLines: {
        color: 'rgba(0, 0, 0, 0.1)',
        lineWidth: 1
      },
      gridLines: {
        color: 'rgba(0, 0, 0, 0.1)',
        circular: false
      }
    }
  }
  Axios.defaults.withCredentials = true
  useEffect(() => {
    isRendered = true
    Axios.get(process.env.REACT_APP_API_URL + '/api/1/dashboard', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      if (isRendered) {
        const data = response.data
        const ram = Number(data[0][0].percent_virtual)
        const cpu = Number(data[1][0].cpu_percent)
        const batterie = Number(data[2][0].battery_percent)
        const storage = (Number(data[3][0].used_storage.slice(0, -2)) / (Number(data[3][0].total_storage.slice(0, -2)) / 100))
        setdatas({
          // eslint-disable-next-line
          ["datasets"]: [
            {
              label: 'Pourcentage',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)',
              data: [batterie, cpu, ram, storage]
            }
          ]
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
        <h1>Dashboard</h1>
        <Radar data={datas} options={RadarOptions} />
      </Grid>
    </Container>
  )
}
export default Dashboard
