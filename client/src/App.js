import React, { useState } from 'react'
import './App.css'

const App = () => {
  const [msg, setMsg] = useState()
  const handleClick = async () => {
    const data = await window.fetch('/api/teste')
    const json = await data.json()
    const msg = json.msg
    setMsg(msg)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={handleClick}>
          Hello world
        </button>
        <p>{msg}</p>
      </header>
    </div>
  )
}

export default App
