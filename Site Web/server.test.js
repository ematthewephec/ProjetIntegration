const { validateEmail } = require('./server')

test('email valide doit sortir', () => {
  const text = validateEmail('louis.bauchau@gmail.com')
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  re.test(String(text).toLowerCase())
  expect(text).toBe('louis.bauchau@gmail.com')
})
