import * as React from 'react'
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

export const ressourcePc = (
  <div>
    <ListSubheader inset>Pc Ressource</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary='Dashboard' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DataSaverOffIcon />
      </ListItemIcon>
      <ListItemText primary='Data' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary='Reports' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BatteryChargingFullIcon />
      </ListItemIcon>
      <ListItemText primary='BatteryChargingFull' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeviceThermostatIcon />
      </ListItemIcon>
      <ListItemText primary='DeviceThermostat' />
    </ListItem>
  </div>
)

export const analyseNet = (
  <div>
    <ListSubheader inset>Network</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <NetworkCheckIcon />
      </ListItemIcon>
      <ListItemText primary='NetworkCheckIcon' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <RouterIcon />
      </ListItemIcon>
      <ListItemText primary='Router' />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AccountTreeIcon />
      </ListItemIcon>
      <ListItemText primary='Port' />
    </ListItem>
  </div>
)
