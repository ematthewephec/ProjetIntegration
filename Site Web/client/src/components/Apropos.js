import React from 'react'
import '../App.css'
import Box from '@mui/material/Box'
import img from '../picture/logo.png'

function Apropos () {
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
        <h1>Notre projet checkpcs (trouver un titre)</h1>
      </Box>
      <Box sx={{ gridArea: 'main', marginLeft: '25%', textAlign: 'left', marginBottom: '6%' }}>
        <p>
          Notre projet Checkpcs à vu le jour en Septembre 2021 et à pour principale objectif
          de récolter divers informations sur l'utilisation des composants de l'odinateur sur
          lequel il est lancé.
        </p>
        <p>
          Il se divise en plusieurs partie, tout d'abord une application Windows permettant de
          récupérer les pourcentages d'utilisation des différents composants. Ensuite, c'est données
          sont dans un premier temps envoyées vers une carte électronique connectée à un écran externe
          qui facilite leurs affichage. Finallement, les informations sont envoyées vers une base de
          données sécurisée afin d'être stockées et être utilisées pour faire des affichages temporels
          sur des graphiques
        </p>

      </Box>
      <Box sx={{ gridArea: 'sidebar', marginRight: '25%', marginBottom: '6%' }}>
        <img
          src={img}
          alt={'logo de l\'entreprise'}
          id='logo'
          loading='lazy'
        />
      </Box>
    </Box>
  )
}

export default Apropos
