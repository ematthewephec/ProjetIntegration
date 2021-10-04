import React from 'react'
import './App.css'
// import Nav from './components/Nav'
import Home from './components/Home'
import Contact from './components/Contact'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import Dashboard from './components/Navbar'
import Navigations from './components/Navigations'

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Navigations />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/Contact' exact component={Contact} />
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
