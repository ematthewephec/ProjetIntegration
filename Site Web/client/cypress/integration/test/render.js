describe('render all the page', () => {
  beforeEach(() => {
    const username = 'rf'
    const password = 'rf'
    cy.visit('/Login')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(`${password}{enter}`)
    // cy.contains('Sign in').click()
    cy.url().should('include', '/')
  })
  it('render correctly', () => {
    cy.visit('/Register')
    cy.contains('Sign up')
    cy.visit('/')
    cy.contains('Notre projet checkpcs')
    cy.visit('/Contact')
    cy.contains('Formulaire de contact')
    cy.visit('/App')
    cy.contains('Dashboard').click()
    cy.get('h1').contains('Dashboard')
    cy.contains('Ram').click()
    cy.get('h1').contains('Ram')
    cy.visit('/Contact')
    cy.contains('Formulaire de contact')
  })
})
