describe('envoyer un mail', () => {
  it('envoie mail', function () {
    const name = 'jean students'
    const email = 'jean@students.com'
    const message = 'hello world'
    cy.visit('/Contact')
    cy.get('input[name=name]').type(name)
    cy.get('input[name=email]').type(email)
    cy.get('#message').type(message)
    cy.contains('Submit').click()
    cy.url().should('include', '/Contact')
  })
})
