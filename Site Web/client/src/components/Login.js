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
import '../App.css'

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

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#072840',
    },
  },
})

export default function SignIn () {
  const [usernames, setUsername] = React.useState('')
  const [passwords, setPassword] = React.useState('')
  const [valid, setvalid] = React.useState(false)
  Axios.defaults.withCredentials = true
  const BASE_URL = process.env.REACT_APP_API_URL
  const login = (event) => {
    event.preventDefault()
    Axios.post(BASE_URL + 'user/Login', {
      username: usernames,
      password: passwords
    }).then((response) => {
      console.log(response)
      if (!response.data.auth) {
        console.log(response.data.auth)
        setvalid(true)
      } else {
        console.log(response.data.token)
        window.localStorage.setItem('token', response.data.accessToken)
        window.localStorage.setItem('refreshToken', response.data.refreshToken)
        window.location.href = '/'
      }
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
            Sign in
          </Typography>
          <Box component='form' onSubmit={login} sx={{ mt: 1 , borderColor: "#072840" }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='username'
              name='username'
              autoComplete='username'
              autoFocus
              onChange={(e) => { setUsername(e.target.value) }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <Button
              type='submit'
              // onClick={login}
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2, backgroundColor: "#072840", ":hover": { backgroundColor: "#072840"} }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='/Forgot' variant='body2' sx={{ color: "#072840" }}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/Register' variant='body2' sx={{ color: "#072840" }}>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {valid && <p>Mauvais mots de passe ou email</p>}
        <Copyright sx={{ mt: 8, mb: 4, color: "#072840" }} />
      </Container>
    </ThemeProvider>
  )
}
