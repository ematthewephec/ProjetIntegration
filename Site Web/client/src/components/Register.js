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

export default function SignUp () {
  const [usernames, setUsername] = React.useState('')
  const [passwords, setPassword] = React.useState('')
  const [emails, seteMail] = React.useState('')
  const [noms, setNom] = React.useState('')
  const [prenoms, setprenom] = React.useState('')
  const BASE_URL = process.env.REACT_APP_API_URL

  Axios.defaults.withCredentials = true
  const register = () => {
    Axios.post(BASE_URL + '/Register', {
      username: usernames,
      password: passwords,
      email: emails,
      nom: noms,
      prenom: prenoms
    }).then((response) => {
      console.log(response)
      window.location.href = '/Login'
    })
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
            Sign up
          </Typography>
          <Box component='form' noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete='fname'
                  name='firstName'
                  required
                  fullWidth
                  id='firstName'
                  label='First Name'
                  autoFocus
                  onChange={(e) => { setprenom(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='lastName'
                  label='Last Name'
                  name='lastName'
                  autoComplete='lname'
                  onChange={(e) => { setNom(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  onChange={(e) => { seteMail(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='username'
                  label='Username'
                  name='Username'
                  autoComplete='Username'
                  onChange={(e) => { setUsername(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  onChange={(e) => { setPassword(e.target.value) }}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={register}
            >
              Sign Up
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link href='/Login' variant='body2'>
                  Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  )
}
