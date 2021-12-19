import React, { createContext } from 'react'
import Axios from 'axios'

export const AppContext = createContext()

class AppContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      app: [],
      pcs: ''
    }
    this.readAppListe()
  }

  // read
  readAppListe () {
    Axios.get(process.env.REACT_APP_API_URL + '/api/pcs', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    }).then((response) => {
      const data = response.data
      console.log(response.data)
      this.setState({
        app: data
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
  }

  render () {
    return (
      <AppContext.Provider value={{
        ...this.state,
        readAppListe: this.readAppListe.bind(this),
        SelectPCs: this.SelectPCs.bind(this)
      }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider
