import React, { createContext } from 'react'
import Axios from 'axios'

export const AppContext = createContext()

class AppContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      app: []
    }
    this.readAppListe()
  }

  // read
  readAppListe () {
    Axios.get(process.env.REACT_APP_API_URL + '/api/1/dashboard', {
      headers: {
        'x-access-token': window.localStorage.getItem('token')
      }
    })
      .then(response => {
        const read = response.data
        if (read.length > 1) {
          read.sort((a, b) => a.idApp > b.idApp ? 1 : -1)
        }
        this.setState({
          app: read
        })
      }).catch(error => {
        console.log(error)
      })
  }

  render () {
    return (
      <AppContext.Provider value={{
        ...this.state,
        createListe: this.createListe.bind(this)
      }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider
