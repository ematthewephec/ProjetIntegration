/**
 * @jest-environment jsdom
 */
import React from 'react'
import SignIn from '../Login'
import ReactDOM from 'react-dom'

test('page home s affiche', () => {
  const div = document.createElement('div')
  ReactDOM.render(<SignIn />, div)
  expect(div.querySelector('h1').textContent).toBe('Sign in')
  const input = [
    { id: 1, url: 'https://www.url1.dev' },
    { id: 2, url: 'https://www.url2.dev' },
    { id: 3, url: 'https://www.link3.dev' }
  ]

  const output = [{ id: 3, url: 'https://www.link3.dev' }]

  expect(filterByTerm(input, 'link')).toEqual(output)

  expect(filterByTerm(input, 'LINK')).toEqual(output)
})

function filterByTerm (inputArr, searchTerm) {
  const regex = new RegExp(searchTerm, 'i')
  return inputArr.filter(function (arrayElement) {
    return arrayElement.url.match(regex)
  })
}
