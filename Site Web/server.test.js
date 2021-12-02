const { validateEmail } = require('./server')

test('email valide doit sortir', () => {
  const text = validateEmail('louis.bauchau@gmail.com')
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  expect(text).toBe(re.test(String('louis.bauchau@gmail.com').toLowerCase()))
})
