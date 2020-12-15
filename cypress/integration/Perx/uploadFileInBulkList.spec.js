const { beforeEach } = require("mocha");

let authorization;

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

function Login() {
  cy.visit("https://dashboard.perxtech.io/dashboard/signin");
  cy.get("#email").type("admin@dashboard.com");

  cy.get("#password").type("admin1234");
  cy.contains("Login").click();
}
describe("Authorization", () => {
  it("Log in as admin, check permissions and upload page", () => {
    Login();

    cy.intercept("GET", "https://api.perxtech.io/v4/dash/authorizations").as("authorizations");

    cy.wait("@authorizations").then((interception) => {
      expect(interception.response.body.data.permissions.length).to.equal(17);
      expect(interception.response.body.data.permissions[9].resource_name).to.equal("bulk_actions");

      cy.get('.ant-menu-item[data-key="bulk_actions"]').click();

      cy.contains("Login");
      cy.get('[type="button"]').click();

      cy.contains("Bulk Upload");
      cy.contains("Click or drag file to this area to upload");
      cy.contains("Accepted Format: .txt, .xlsx or .csv files only");
    });
  });

  it("Make Bulk Upload ", () => {
    Login();

    cy.wait(1000);
    cy.visit("https://dashboard.perxtech.io/dashboard/p/bulkaction");
    cy.get('.ant-menu-item[data-key="bulk_actions"]').click();
  });
});
