let authorization;

function Login(){
    cy.visit('https://dashboard.perxtech.io/dashboard/signin')
    cy.get('#email')
    .type('reward_admin@dashboard.com')
  
    cy.get('#password')
    .type('reward_admin')
    cy.contains('Login').click()
}
describe('authorization', () => {
    it('Log in as reward moderator and check permission', () => {

      Login();

      cy.intercept('GET', 'https://api.perxtech.io/v4/dash/authorizations').as('authorizations')

      cy.wait('@authorizations') 

      .then((interception) => {
        expect(interception.response.body.data.permissions.length).to.equal(1)
        expect(interception.response.body.data.permissions[0].resource_name).to.equal("rewards")
    })
})

    it('Check if non-authorized user can access detail/edit pages', () => {
        cy.visit('https://dashboard.perxtech.io/p/rewards/edit/11553')
        cy.wait(1000)
        cy.url().should('match', /signin/)

        cy.visit('https://dashboard.perxtech.io/dashboard/p/rewards/create')
        cy.wait(1000)
        cy.url().should('match', /signin/)
})

    it('Check Create button', () => {
        Login();

        cy.wait(1000)
        cy.visit('https://dashboard.perxtech.io/dashboard/p/rewards/list')
        cy.contains('Create New').click()
        
})
    
    
})
