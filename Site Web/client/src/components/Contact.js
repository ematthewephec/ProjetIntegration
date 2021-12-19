import React, { useReducer } from 'react'
import '../App.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ReCAPTCHA from 'react-google-recaptcha'

function Contact () {
  const recaptchaRef = React.createRef()

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
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/mail')
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
      xhr.send(JSON.stringify(data))
      evt.preventDefault()
    } else {
      alert("Suspicion d'utilisation de BOT")
      window.location.reload()
    }
  }

  const handleInput = evt => {
    const name = evt.target.name
    const newValue = evt.target.value
    setFormInput({ [name]: newValue })
    evt.preventDefault()
  }

  return (
    <div>
      <h1 id='form_title'>Formulaire de contact</h1>
      <form onSubmit={handleSubmit} id='formulaire'>
        <TextField name='name' onChange={handleInput} label='Full Name' sx={{ width: '50%', paddingBottom: '2%', marginTop: '2%' }} autocomplete='none' required /><br />
        <TextField name='nickname' onChange={handleInput} label='nickname' sx={{ display: 'none', zIndex: -1 }} autocomplete='on' /><br />
        <TextField name='email' label='Email' onChange={handleInput} sx={{ width: '50%', paddingBottom: '2%' }} autocomplete='none' required /><br />
        <TextField name='question' onChange={handleInput} label='question' sx={{ display: 'none', zIndex: -1 }} autocomplete='none' /><br />
        <TextField name='message' label='Message' onChange={handleInput} sx={{ width: '50%', paddingBottom: '2%' }} multiline rows={5} autocomplete='none' required /><br />
        <ReCAPTCHA
          ref={recaptchaRef}
          name='isVerif'
          id='captcha'
          render='explicite'
          sitekey='6LeyelEdAAAAAIRs-SjSN4mpouvLy6adWxhRcWah'
        />
        <Button sx={{ width: '50%', color: 'black' }} style={{ backgroundColor: '#d1ffbe', opacity: '0.5' }} type='submit'>Submit</Button>
      </form>
    </div>
  )
}

export default Contact
