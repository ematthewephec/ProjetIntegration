import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Axios from 'axios'

function Copyright (props) {
  return (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      .
    </Typography>
  )
}

const theme = createTheme()

export default function Newpassword () {
  const [passwords, setPassword] = React.useState('')
  const [passwords1, setPassword1] = React.useState('')
  const BASE_URL = process.env.REACT_APP_API_URL
  const [valid, setvalid] = React.useState(false)
  const [valid1, setvalid1] = React.useState(false)
  Axios.defaults.withCredentials = true
  const Newpass = (event) => {
    event.preventDefault()
    if (passwords === passwords1) {
      Axios.post(BASE_URL + 'user/NewPassword', {
        password: passwords
      }, {
        headers: {
          'x-access-token': window.localStorage.getItem('token')
        }
      }).then((response) => {
        console.log(response)
        window.location.href = '/Login'
        if (response.data.valid) {
          window.location.href = '/Login'
        } else {
          setvalid1(true)
        }
      })
    } else {
      setvalid(true)
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Réinitialisé le password
          </Typography>
          <Box component='form' onSubmit={Newpass} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={passwords.length < 9 && passwords.length > 0}
                  helperText='rem : 9 caractère min'
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='New password'
                  id='password'
                  autoComplete='new-password'
                  onChange={(e) => { setPassword(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={passwords.length < 9 && passwords.length > 0}
                  helperText='rem : 9 caractère min'
                  required
                  fullWidth
                  name='password'
                  label='New Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  onChange={(e) => { setPassword1(e.target.value) }}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              type='submit'
            >
              New password
            </Button>
          </Box>
        </Box>
        {valid && <p>Password pas identique</p>}
        {valid1 && <p>Password invalide</p>}
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}
