import React from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import LineData from '../schema/LineData'

function Baterry () {
  return (
    <Container>
      <Grid Container spacing={3}>
        <h1>Battery</h1>
        <LineData />
      </Grid>
    </Container>
  )
}

export default Baterry
