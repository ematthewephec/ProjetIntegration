import React from 'react'
import './App.css'
// import Nav from './components/Nav'
import Home from './components/Home'
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
          <Route path='/' exact component={Home}>
            <Navigations test="relative" />
          </Route>
          <Route path='/Contact' exact component={Contact}>
            <Navigations />
            <Contact/>
            <Apropos/>
          </Route>
          <Route path='/Shop' exact component={Shop}>
            <Navigations />
            <Shop />
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