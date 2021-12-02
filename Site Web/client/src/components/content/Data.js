import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Doughnuts from '../schema/Doughnut'

function Data () {
  return (
    <Container>
      <Grid Container spacing={3}>
        <h1>Data</h1>
        <Doughnuts />
      </Grid>
    </Container>
  )
}

export default Data
