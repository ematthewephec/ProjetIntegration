describe('logout', () => {
  beforeEach(() => {
    const username = 'rf'
    const password = 'rf'
    cy.visit('/Login')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(`${password}{enter}`)
    // cy.contains('Sign in').click()
    cy.url().should('include', '/')
  })
  it('lougout', () => {
    cy.contains('Logout').click()
    cy.url().should('include', '/Login')
  })
})
