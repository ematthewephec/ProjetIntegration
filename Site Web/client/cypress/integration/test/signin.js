describe('test connection et redirect home', () => {
  it('test connection', function () {
    const username = 'rf'
    const password = 'rf'
    cy.visit('/Login')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(`${password}{enter}`)
    // cy.contains('Sign in').click()
    cy.url().should('include', '/')
  })
})
