import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Axios from 'axios'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

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

export default function SignIn () {
  const [usernames, setUsername] = React.useState('')
  const [passwords, setPassword] = React.useState('')
  const [loginStatus, setLoginStatus] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const login = () => {
    Axios.post('http://localhost:5000/Login', {
      username: usernames,
      password: passwords
    }).then((response) => {
      if (!response.data.auth) {
        setLoginStatus(false)
      } else {
        localStorage.setItem('token', response.data.token)
        console.log('lol')
        setLoginStatus(true)
      }
    })
    setOpen(true)
  }
  const userAuthenticated = () => {
    Axios.get('http://localhost:5000/isUserAuth', {
      hearders: {
        'x-access-token': localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response)
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
          <Box component='form' noValidate sx={{ mt: 1 }}>
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
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button
              onClick={login}
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='/Register' variant='body2'>
                  Register
                </Link>
              </Grid>
              <Grid item>
                <Link href='/' variant='body2'>
                  Homese
                </Link>
              </Grid>
            </Grid>
            <button onClick={userAuthenticated}>check if auuth </button>
            {loginStatus && (
              <button onClick={userAuthenticated}>check if auuth </button>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}
