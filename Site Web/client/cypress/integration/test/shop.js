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
    const email = 'jean@students.com'
    cy.contains('Sélectionner').click()
    cy.fillElementsInput('cardNumber', '4242424242424242');
    cy.fillElementsInput('cardExpiry', '1025'); // MMYY
    cy.fillElementsInput('cardCvc', '123');
  })
})

