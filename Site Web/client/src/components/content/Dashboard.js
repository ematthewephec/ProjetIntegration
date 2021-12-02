import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Radars from '../schema/Radar'

function Dashboard () {
  return (
    <Container>
      <Grid Container spacing={3}>
        <h1>Dashboard</h1>
        <Radars />
      </Grid>
    </Container>
  )
}

export default Dashboard
