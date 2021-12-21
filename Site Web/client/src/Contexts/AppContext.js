import React, { createContext } from 'react'
import Axios from 'axios'

export const AppContext = createContext()

class AppContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      app: [],
      pcs: '',
      ram: {},
      storage: {},
      cpu: {},
      battery: {},
      dashboard: {}
    }
    this.readPcs()
    this.readCpu()
    this.readStorage()
    this.readRam()
    this.readBattery()
    this.readDashboard()
  }

  // read
  readPcs () {
    Axios.get(process.env.REACT_APP_API_URL + 'resource/pcs', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      const data = response.data
      console.log(response.data[0].idPc)
      this.setState({
        app: data,
        pcs: response.data[0].idPc
      })
    }).catch(error => {
      console.log(error)
    })
  }

  readRam () {
    Axios.get(process.env.REACT_APP_API_URL + 'resource/ram', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      const data = response.data
      console.log(response.data)
      const title = []
      const percent = []

      for (const i of data) {
        if (i.idPc === this.state.pcs) {
          title.push(i.test_date)
          percent.push(((Number((i.total_virtual).slice(0, -2)) / 100) * Number(i.percent_virtual)).toFixed(2))
        }
      }
      this.setState({
        ram: { title: title, percent: percent }
      })
    }).catch(error => {
      console.log(error)
    })
  }

  readCpu () {
    Axios.get(process.env.REACT_APP_API_URL + 'resource/cpu', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      const data = response.data
      console.log(data)
      const title = []
      const percent = []
      for (const i of data) {
        if (i.idPc === this.state.pcs) {
          title.push(i.test_date)
          percent.push(Number((i.cpu_percent)))
        }
      }
      console.log(this.state.pcs)
      this.setState({
        cpu: { title: title, percent: percent }
      })
    }).catch(error => {
      console.log(error)
    })
  }

  readStorage () {
    Axios.get(process.env.REACT_APP_API_URL + 'resource/storage', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      const data = response.data
      console.log(response.data)
      const title = []
      const percent = []
      for (const i of data) {
        if (i.idPc === this.state.pcs) {
          title.push(i.test_date)
          percent.push((Number((i.used_storage).slice(0, -2)) / (Number((i.total_storage).slice(0, -2)) / 100)).toFixed(2))
        }
      }
      this.setState({
        storage: { title: title, percent: percent }
      })
    }).catch(error => {
      console.log(error)
    })
  }

  readDashboard () {
    Axios.get(process.env.REACT_APP_API_URL + 'resource/dashboard', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      const data = response.data
      console.log(response.data)
      let ram = ''
      let cpu = ''
      let battery = ''
      let storage = ''
      for (const i of data[0]) {
        if (i.idPc === this.state.pcs) {
          ram = Number(i.percent_virtual)
          console.log(ram)
        }
      }
      for (const i of data[1]) {
        if (i.idPc === this.state.pcs) {
          cpu = Number(i.cpu_percent)
        }
      }
      for (const i of data[2]) {
        if (i.idPc === this.state.pcs) {
          battery = Number(i.battery_percent)
        }
      }
      for (const i of data[3]) {
        if (i.idPc === this.state.pcs) {
          storage = (Number(i.used_storage.slice(0, -2)) / (Number(i.total_storage.slice(0, -2)) / 100))
        }
      }
      this.setState({
        dashboard: { ram: ram, cpu: cpu, battery: battery, storage: storage }
      })
      console.log(this.state.dashboard)
    }).catch(error => {
      console.log(error)
    })
  }

  readBattery () {
    Axios.get(process.env.REACT_APP_API_URL + 'resource/battery', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      const data = response.data
      const title = []
      const percent = []

      for (const i of data) {
        if (i.idPc === this.state.pcs) {
          title.push(i.test_date)
          percent.push(Number((i.battery_percent)))
        }
      }
      this.setState({
        battery: { title: title, percent: percent }
      })
    }).catch(error => {
      console.log(error)
    })
  }

  SelectPCs (Selectpc) {
    console.log(Selectpc)
    this.setState({
      pcs: Selectpc
    })
    this.readCpu()
    this.readStorage()
    this.readRam()
    this.readBattery()
    this.readDashboard()
  }

  render () {
    return (
      <AppContext.Provider value={{
        ...this.state,
        readPcs: this.readPcs.bind(this),
        readRam: this.readRam.bind(this),
        readCpu: this.readCpu.bind(this),
        readStorage: this.readStorage.bind(this),
        readDashboard: this.readDashboard.bind(this),
        readBattery: this.readBattery.bind(this),
        SelectPCs: this.SelectPCs.bind(this)
      }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider
