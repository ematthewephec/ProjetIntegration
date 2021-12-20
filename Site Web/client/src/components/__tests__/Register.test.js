/**
 * @jest-environment jsdom
 */
import React from 'react'
import ReactDOM from "react-dom";
import SignUp from '../Register'

test("render du composant SignUp", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  expect(div.querySelector('h1').textContent).toBe('Sign up');
});

test("Test si le composant contient l'input First Name", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  expect(div.querySelectorAll("input[id='firstName']")[0].getAttribute('name')).toBe('firstName');
  expect(div.querySelectorAll("input[id='firstName']")[0].getAttribute('type')).toBe('text');
});

test("Test si le composant contient l'input Last Name", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  expect(div.querySelectorAll("input[id='lastName']")[0].getAttribute('name')).toBe('lastName');
  expect(div.querySelectorAll("input[id='lastName']")[0].getAttribute('type')).toBe('text');
});

test("Test si le composant contient l'input Email", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  expect(div.querySelectorAll("input[id='email']")[0].getAttribute('name')).toBe('email');
  expect(div.querySelectorAll("input[id='email']")[0].getAttribute('type')).toBe('text');
});

test("Test si le composant contient l'input username", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  expect(div.querySelectorAll("input[id='username']")[0].getAttribute('name')).toBe('Username');
  expect(div.querySelectorAll("input[id='username']")[0].getAttribute('type')).toBe('text');
});

test("Test si le composant contient l'input password", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  expect(div.querySelectorAll("input[id='password']")[0].getAttribute('name')).toBe('password');
  expect(div.querySelectorAll("input[id='password']")[0].getAttribute('type')).toBe('password');
});

test("Test si le composant contient le bouton d'inscription", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SignUp />, div);
  expect(div.querySelector('button').textContent).toBe('Sign Up');
  expect(div.querySelectorAll("button")[0].getAttribute('type')).toBe('button');
});