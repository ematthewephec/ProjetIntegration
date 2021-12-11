import React, { useEffect } from 'react'
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
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff'
import ListSubheader from '@mui/material/ListSubheader'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import RouterIcon from '@mui/icons-material/Router'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import Dashboard from './content/Dashboard'
import Routers from './content/Routers'
import Baterry from './content/Battery'
import Data from './content/Data'
import Network from './content/Network'
import Port from './content/Port'
import Reports from './content/Reports'
import Thermostat from './content/Thermostat'
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
  const [open, setOpen] = React.useState(true)
  const [select, setSelected] = React.useState('Dashboard')
  const pos = (window.location.pathname !== '/App' ? 'relative' : 'absolute')
  window.location.pathname !== '/App' ? drawerWidth = 0 : drawerWidth = 240
  const title = 'Checkpcs'
  const toggleDrawer = () => {
    setOpen(!open)
  }
  // FONCTION ROLE : ne pas Axios.defaults.withCredentials = true
  Axios.defaults.withCredentials = true
  const [role, setRole] = React.useState('')
  const [role2, setRole2] = React.useState('')
  useEffect(() => {
    Axios.get('http://localhost:5000/Login').then((response) => {
      console.log(response.data)
      if (response.data.loggedIn === true) {
        setRole(response.data.user[0].role)
      } else {
        setRole('visitor')
      }
    })
  })
  useEffect(() => {
    Axios.get('http://localhost:5000/isUserAuth', {
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
    Axios.get('http://localhost:5000/Logout', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      window.localStorage.clear()
      setRole2('visitor')
      window.location.href = '/Login'
    })
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
                // onClick={toggleDrawer}
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
              <List>
                <ListSubheader inset>Pc Ressource</ListSubheader>
                <ListItem button onClick={() => { setSelected('Dashboard') }}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary='Dashboard' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Data') }}>
                  <ListItemIcon>
                    <DataSaverOffIcon />
                  </ListItemIcon>
                  <ListItemText primary='Data' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('Reports') }}>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary='Reports' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('BatteryChargingFull') }}>
                  <ListItemIcon>
                    <BatteryChargingFullIcon />
                  </ListItemIcon>
                  <ListItemText primary='BatteryChargingFull' />
                </ListItem>
                <ListItem button onClick={() => { setSelected('DeviceThermostat') }}>
                  <ListItemIcon>
                    <DeviceThermostatIcon />
                  </ListItemIcon>
                  <ListItemText primary='DeviceThermostat' />
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
              {select === 'Data' &&
                <Data />}
              {select === 'Reports' &&
                <Reports />}
              {select === 'BatteryChargingFull' &&
                <Baterry />}
              {select === 'Router' &&
                <Routers />}
              {select === 'DeviceThermostat' &&
                <Thermostat />}
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
