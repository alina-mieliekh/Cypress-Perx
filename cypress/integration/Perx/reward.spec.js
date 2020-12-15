const { beforeEach } = require("mocha");

let authorization;

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

function Login() {
  cy.visit("https://dashboard.perxtech.io/dashboard/signin");
  cy.get("#email").type("reward_admin@dashboard.com");

  cy.get("#password").type("reward_admin");
  cy.contains("Login").click();
}
describe("Reward", () => {
  it("Log in as reward moderator and check permission", () => {
    Login();

    cy.intercept("GET", "https://api.perxtech.io/v4/dash/authorizations").as("authorizations");

    cy.wait("@authorizations").then((interception) => {
      expect(interception.response.body.data.permissions.length).to.equal(1);
      expect(interception.response.body.data.permissions[0].resource_name).to.equal("rewards");
    });
  });

  it("Check if non-authorized user can access detail/edit pages", () => {
    cy.visit("https://dashboard.perxtech.io/p/rewards/edit/11553");
    cy.wait(1000);
    cy.url().should("match", /signin/);

    cy.visit("https://dashboard.perxtech.io/dashboard/p/rewards/create");
    cy.wait(1000);
    cy.url().should("match", /signin/);
  });

  it("Check Reward Page", () => {
    Login();

    cy.wait(1000);
    cy.visit("https://dashboard.perxtech.io/dashboard/p/rewards/list");
    cy.contains("Create New").click();
    cy.url().should('include', 'https://dashboard.perxtech.io/dashboard/p/rewards/create')
    cy.contains("Reward Info")
    cy.contains("Reward Details")

    
  });

  it("Check Reward creation", () => {
    Login();

    cy.wait(1000);
    cy.visit("https://dashboard.perxtech.io/dashboard/p/rewards/list");
    cy.contains("Create New").click();
    cy.get('[name="name_en"]').type('Test')
    cy.get('[name="subtitle_en"]').type('Testing')
    cy.get('.ant-row:nth-child(4) [contenteditable="true"]').type('Test')
    cy.get('.ant-row:nth-child(5) [contenteditable="true"]').type('Test Test')
    cy.get('.ant-row:nth-child(6) [contenteditable="true"]').type('Test Test Test')
    cy.get('.ant-row:nth-child(7) .ant-select').click();
    cy.get('.ant-select-dropdown li:nth-child(4)').click();
    cy.get('body').click();

     cy.get('.ant-row:nth-child(8) .ant-select').click();
     cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden) li:nth-child(3)').click();
     cy.get('body').click();

     cy.get('.ant-row:nth-child(9) .ant-form-item-children').click();
     cy.get('div input[type=checkbox]').click({ multiple: true });
     cy.get('body').click();

     cy.get('.ant-row:nth-child(10) .ant-form-item-children').click();
     cy.get('div input[type=checkbox]').click({ multiple: true });
     cy.get('body').click();

     cy.get('.ant-row:nth-child(11) .ant-select').click();
     cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden) li:nth-child(3)').click();
     cy.get('body').click();

      //cy.get('.spaced-extra [type="button"]').click();
      // const testImg = 'images/Test.jpg';
      // cy.get('.ant-modal-body .ant-col [for="image_uploads_undefined"]').attachFile(testImg, { force: true });
      // cy.wait(1000);
      // cy.get('.ant-modal-footer [type="button"]:nth-child(3)').click();
      
     cy.get('.ant-row:nth-child(4) [contenteditable="true"]').type('Test')
     cy.get('body').click();
    
    cy.get('.ant-card-body .ant-row:nth-child(1) .ant-calendar-picker-input').click()
    cy.get('.ant-calendar-footer .ant-calendar-today-btn').click()
    cy.get('body').click();

    cy.wait(1000);

    cy.get('.ant-card-body .ant-row:nth-child(2) .ant-calendar-picker-input').click()
    cy.get('.ant-calendar-footer .ant-calendar-today-btn').click()
    cy.get('.ant-calendar-next-year-btn').click()
    cy.get('[title$="28, 2021"]:not(.ant-calendar-last-month-cell)').click()
    cy.wait(1000);
    cy.get('body').click();
     
     cy.get('.steps-action .ant-btn.ant-btn-primary.ant-btn-lg').click();
     cy.wait(1000);
     
     cy.get('.ant-card-body .ant-row:nth-child(2) .ant-calendar-picker-input').click()
     cy.get('.ant-calendar-footer .ant-calendar-today-btn').click()
     cy.get('.ant-calendar-next-year-btn').click()
     cy.get('[title$="28, 2021"]:not(.ant-calendar-last-month-cell)').click()
     cy.wait(1000);
     cy.get('body').click();

     cy.get('.steps-action .ant-btn.ant-btn-primary.ant-btn-lg').click();
     cy.wait(1000);

     cy.get('[type="submit"]').click()

     
  });
});
