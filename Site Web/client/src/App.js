import React from 'react'
import './App.css'
// import Nav from './components/Nav'
import Contact from './components/Contact'
import Apropos from './components/Apropos'
import Login from './components/Login'
import Register from './components/Register'
import Shop from './components/shop'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import Dashboard from './components/Navbar'
import Navigations from './components/Navigations'

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/' exact component={Navigations}>
            <Navigations />
            <Apropos />
            <Shop />
          </Route>
          <Route path='/App' exact component={Navigations}>
            <Navigations />
          </Route>
          <Route path='/Contact' exact component={Navigations}>
            <Navigations />
            <Contact />
          </Route>
          <Route path='/Login' exact component={Login}>
            <Login />
          </Route>
          <Route path='/Register' exact component={Register}>
            <Register />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
/*
const [msg, setMsg] = useState()
  const handleClick = async () => {
    const data = await window.fetch('/api/teste')
    const json = await data.json()
    const msg = json.msg
    setMsg(msg)
  }
          <button onClick={handleClick}>
            Hello world
          </button>
          <p>{msg}</p>
        */
