describe('test inscription et et connection et redirect home', () => {
  it('test connection', function () {
    const firstName = 'student'
    const lastName = 'jean'
    const Username = 'studentsjean'
    const username = 'studentsjean'
    const password = 'studentsjean'
    const email = 'jean@students.com'
    cy.visit('/Register')
    cy.get('input[name=firstName]').type(firstName)
    cy.get('input[name=lastName]').type(lastName)
    cy.get('input[name=email]').type(email)
    cy.get('input[name=Username]').type(Username)
    cy.get('input[name=password]').type(`${password}{enter}`)
    // cy.contains('Sign in').click()
    cy.url().should('include', '/Login')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(`${password}{enter}`)
    // cy.contains('Sign in').click()
    cy.url().should('include', '/')
  })
})
