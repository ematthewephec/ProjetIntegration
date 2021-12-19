import React from 'react'
import '../../App.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

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
        <h4>Pour accéder à cette page suivez les instructions : </h4>
      </Box>
      <Box sx={{ gridArea: 'main', marginLeft: '25%', textAlign: 'left', marginBottom: '6%' }}>
        <p>
          1. Vérifier si vous etes bien connecter
        </p>
        <Button color='inherit' href='/Login'>Login</Button>
        <p>
          2. Lancer l'application checkpcs sur le desktop
        </p>
        <p>
          3. Avez vous acheter un accès au sites web
        </p>
      </Box>
    </Box>
  )
}

export default Instruction
