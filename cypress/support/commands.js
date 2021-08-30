/// <reference  types = "cypress" /> 
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  //headless auth
  const user = {
    "user":
    {
      "email": "testingsayfabbas123@test.com",
      "password": "TestTest123"
    }
  }

  cy.request('POST',
    'https://conduit.productionready.io/api/users/login',
    user)
    .its('body').then(body => {
      const { token } = body.user

      cy.wrap(token).as('token')

      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('jwtToken', token)
        }
      })

    })

  // old traditional way (add email,password parameters to the function)

  /* cy.visit('/login')
  cy.get('[placeholder="Email"]').type(email)
  cy.get('[placeholder="Password"]').type(password)
  cy.get('form').submit() */

})
