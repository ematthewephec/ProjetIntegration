import React from 'react'
import '../../App.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

function Instruction () {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
        gridTemplateRows: 'auto',
        gridTemplateAreas: `"header header header header"
  "main main sidebar sidebar"`
      }}
    >
      <Box sx={{ gridArea: 'header', margin: '3%' }}>
        <h5>Pour accéder à cette page suivez les instructions </h5>
      </Box>
      <Box sx={{ gridArea: 'main', marginLeft: '25%', textAlign: 'left', marginBottom: '6%' }}>
        <Typography variant='h6' gutterBottom>
          Etape 1 : Sélectionner un Pc
        </Typography>
        <Typography variant='h6' gutterBottom>
          Etape 2 : Vérifier si vous êtes connectés
          <Button color='inherit' href='/Login'>Login</Button>
        </Typography>
        <Typography variant='h6' gutterBottom>
          Etape 3 : Lancer l'application checkpcs sur le desktop
        </Typography>
        <Typography variant='h6' gutterBottom>
          Etape 4 : Avez vous acheter un accès au sites web
        </Typography>
        <Typography variant='h6' gutterBottom>
          Etape 5 : Contacter nous par email
        </Typography>
      </Box>
    </Box>
  )
}

export default Instruction
