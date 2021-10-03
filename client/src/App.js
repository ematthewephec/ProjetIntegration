import React, { useState } from 'react'
import './App.css'
import Nav from './components/Nav'
import Home from './components/Home'
import Contact from './components/Contact'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const App = () => {
  const [msg, setMsg] = useState()
  const handleClick = async () => {
    const data = await window.fetch('/api/teste')
    const json = await data.json()
    const msg = json.msg
    setMsg(msg)
  }

  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <Nav />
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/Contact' exact component={Contact} />
          </Switch>
          <button onClick={handleClick}>
            Hello world
          </button>
          <p>{msg}</p>
        </header>
      </div>
    </Router>
  )
}

export default App
