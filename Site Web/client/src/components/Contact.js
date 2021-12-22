import React, { useReducer } from 'react'
import '../App.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ReCAPTCHA from 'react-google-recaptcha'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Axios from 'axios'


const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#072840',
    },
  },
})

function Contact () {
  const BASE_URL = process.env.REACT_APP_API_URL
  const recaptchaRef = React.createRef()
  Axios.defaults.withCredentials = true
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      email: '',
      message: '',
      isVerif: '',
      nickname: '',
      question: ''
    }
  )

  const handleSubmit = evt => {
    const data = formInput
    data.isVerif = recaptchaRef.current.getValue()

    if (data.question === '' && data.nickname === '') {
      /*
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://www.checkpcs.com/api/mail/')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.onload = function () {
        if (xhr.responseText === 'success') {
          alert('Mail envoyé avec success')
          let form = document.forms.formulaire
          form.name.value = ''
          form.email.value = ''
          form.message.value = ''
          recaptchaRef.current.reset()
        } else if (xhr.responseText === 'error') {
          alert("Erreure lors de l'envois du mail")
          let form = document.forms.formulaire
          form.name.value = ''
          form.email.value = ''
          form.message.value = ''
          recaptchaRef.current.reset()
        }
      }
      console.log(JSON.stringify(data))
      xhr.send(JSON.stringify(data))
      evt.preventDefault()
      */
      evt.preventDefault()
      console.log(data)
      console.log(data.name)
      Axios.post(BASE_URL + 'mail/', { data: data }
      )
        .then((response) => {
          console.log(response)
        })
    } else {
      alert("Suspicion d'utilisation de BOT")
      // window.location.reload()
    }
  }

  const handleInput = evt => {
    const name = evt.target.name
    const newValue = evt.target.value
    setFormInput({ [name]: newValue })
    evt.preventDefault()
  }

  return (
    <ThemeProvider theme={theme}>
    <div>
      <h1 id='form_title'>Formulaire de contact</h1>
      <form onSubmit={handleSubmit} id='formulaire'>
        <TextField id='fullName' name='name' onChange={handleInput} label='Full Name' sx={{ width: '50%', paddingBottom: '2%', marginTop: '2%' }} autocomplete='none' required /><br />
        <TextField name='nickname' onChange={handleInput} label='nickname' sx={{ display: 'none', zIndex: -1 }} autocomplete='on' /><br />
          <TextField id='email' name='email' label='Email' onChange={handleInput} sx={{ width: '50%', paddingBottom: '2%' }} autocomplete='none' required /><br />
        <TextField name='question' onChange={handleInput} label='question' sx={{ display: 'none', zIndex: -1 }} autocomplete='none' /><br />
          <TextField id='message' name='message' label='Message' onChange={handleInput} sx={{ width: '50%', paddingBottom: '2%' }} multiline rows={5} autocomplete='none' required /><br />
        <ReCAPTCHA
          ref={recaptchaRef}
          name='isVerif'
          id='captcha'
          render='explicite'
          sitekey='6LeyelEdAAAAAIRs-SjSN4mpouvLy6adWxhRcWah'
        />
        <Button sx={{ width: '50%', color: 'black' }} style={{ backgroundColor: '#2BFF00', opacity: '1', marginBottom: "4%" }} type='submit'>Submit</Button>
      </form>
    </div>
    </ThemeProvider>
  )
}

export default Contact
