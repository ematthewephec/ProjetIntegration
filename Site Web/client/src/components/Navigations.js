import React, { useEffect, useContext } from 'react'
// import Nav from './components/Nav'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Button from '@mui/material/Button'
import { List } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
// import Dashboard from './components/Navbar'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'
import BarChartIcon from '@mui/icons-material/BarChart'
import ListSubheader from '@mui/material/ListSubheader'
import StorageIcon from '@mui/icons-material/Storage'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import MemoryIcon from '@mui/icons-material/Memory'
import RouterIcon from '@mui/icons-material/Router'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import Dashboard from './content/Dashboard'
import Routers from './content/Routers'
import Baterry from './content/Battery'
import Ram from './content/Ram'
import Network from './content/Network'
import Port from './content/Port'
import { AppContext } from '../Contexts/AppContext'
import Processeur from './content/Processeur'
import Stockage from './content/Stockage'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Axios from 'axios'

// import Chart from './Charts'
// import Deposits from './Deposits'
// import Orders from './Orders'

let drawerWidth = 240 // ce qu'il faut changer pour la page contact
const mdTheme = createTheme()

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9)
        }
      })
    }
  })
)

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

const Navigations = () => {
  const [age, setAge] = React.useState('')
  const context = useContext(AppContext)
  const [open, setOpen] = React.useState(true)
  const [select, setSelected] = React.useState('Dashboard')
  const BASE_URL = process.env.REACT_APP_API_URL
  const pos = (window.location.pathname !== '/App' ? 'relative' : 'absolute')
  window.location.pathname !== '/App' ? drawerWidth = 0 : drawerWidth = 240
  const title = 'Checkpcs'
  const toggleDrawer = () => {
    setOpen(!open)
  }
  // FONCTION ROLE : ne pas Axios.defaults.withCredentials = true
  Axios.defaults.withCredentials = true
  const [role2, setRole2] = React.useState('')
  let list = ''
  if (window.location.pathname === '/App') {
    list = context.app.map((number) =>
      <MenuItem value={number.idPc} key={number.idPc}>{number.user_name}</MenuItem>
    )
  }

  /*
  useEffect(() => {
    Axios.get(BASE_URL + '/Login').then((response) => {
      console.log(response.data)
      if (response.data.loggedIn === true) {
        setRole(response.data.user[0].role)
      } else {
        setRole('visitor')
      }
    })
  })
  const [pcTitle, SetPcTitle] = React.useState('')
  useEffect(() => {
    Axios.get(BASE_URL + '/api/pcs', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response.data)
    })
  })
  */
  useEffect(() => {
    Axios.get(BASE_URL + '/isUserAuth', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      console.log(response)
      if (response.data.auth === false) {
        setRole2('visitor')
      } else if (response.data.user.isAdmin === false) {
        setRole2('client')
      } else {
        setRole2('Admin')
      }
    })
  })
  const logout = () => {
    Axios.get(BASE_URL + '/Logout', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      window.localStorage.clear()
      setRole2('visitor')
      window.location.href = '/Login'
    })
  }
  const handleChange = (event) => {
    setAge(event.target.value)
    if (window.location.pathname === '/App') {
      context.SelectPCs(event.target.value)
    }
  }
  return (
    <div>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position={pos} open={open}>
            <Toolbar
              sx={{
                pr: '24px' // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge='start'
                color='inherit'
                aria-label='open drawer'
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' })
                }}
              >
                <MenuIcon />
              </IconButton>
              <Button color='inherit' href='/'>
                Home
              </Button>
              <Typography
                component='h1'
                variant='h6'
                color='inherit'
                noWrap
                sx={{ flexGrow: 1 }}
              >
                {title}
              </Typography>
              <Button color='inherit' href='/Contact'>
                contact
              </Button>
              <Button color='inherit' href='/App'>
                App
              </Button>
              {role2 !== 'visitor' &&
                <Button color='inherit' onClick={logout}>
                  Logout
                </Button>}
              {role2 === 'visitor' &&
                <Button color='inherit' href='/Login'>
                  Login
                </Button>}
              {role2 === 'visitor' &&
                <Button color='inherit' href='/Register'>
                  Register
                </Button>}
            </Toolbar>
          </AppBar>
          {window.location.pathname === '/App' &&
            <Drawer variant='permanent' open={open}>
              <Toolbar
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1]
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              <Box sx={{ maxWidth: 180 }}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-label'>Sélectionner votre PC</InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={age}
                    label='Age'
                    onChange={handleChange}
                  >
                    {list}
                  </Select>
                </FormControl>
              </Box>
              <List>
                <ListSubheader inset>Pc Ressource</ListSubheader>
                <ListItem button onClick={() => { setSelected('Dashboard') }}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary='Dashboard' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Ram') }}>
                  <ListItemIcon>
                    <MemoryIcon />
                  </ListItemIcon>
                  <ListItemText primary='Ram' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Processeur') }}>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary='Processeur' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Battery') }}>
                  <ListItemIcon>
                    <BatteryChargingFullIcon />
                  </ListItemIcon>
                  <ListItemText primary='Batterie' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Stockage') }}>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary='Stockage' />
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListSubheader inset>Network</ListSubheader>
                <ListItem button onClick={() => { setSelected('NetworkCheckIcon') }}>
                  <ListItemIcon>
                    <NetworkCheckIcon />
                  </ListItemIcon>
                  <ListItemText primary='NetworkCheckIcon' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Router') }}>
                  <ListItemIcon>
                    <RouterIcon />
                  </ListItemIcon>
                  <ListItemText primary='Router' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Port') }}>
                  <ListItemIcon>
                    <AccountTreeIcon />
                  </ListItemIcon>
                  <ListItemText primary='Port' />
                </ListItem>
              </List>
            </Drawer>}
          {window.location.pathname === '/App' &&
            <Box
              component='main'
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto'
              }}
            >
              <Toolbar />
              {select === 'Dashboard' &&
                <Dashboard />}
              {select === 'Ram' &&
                <Ram />}
              {select === 'Processeur' &&
                <Processeur />}
              {select === 'Battery' &&
                <Baterry />}
              {select === 'Router' &&
                <Routers />}
              {select === 'Stockage' &&
                <Stockage />}
              {select === 'Port' &&
                <Port />}
              {select === 'NetworkCheckIcon' &&
                <Network />}
              <Copyright sx={{ pt: 4 }} />
            </Box>}
        </Box>
      </ThemeProvider>
    </div>
  )
}

export default Navigations
