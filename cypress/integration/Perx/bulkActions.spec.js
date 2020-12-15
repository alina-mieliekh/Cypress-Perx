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

describe("Upload File in Bulk Actions", () => {
  it("Check Bulk Actions permissions as Admin", () => {
    Login();

    cy.intercept("GET", "https://api.perxtech.io/v4/dash/authorizations").as("authorizations");

    cy.wait("@authorizations").then((interception) => {
      expect(interception.response.body.data.permissions.length).to.equal(17);
      expect(interception.response.body.data.permissions[9].resource_name).to.equal("bulk_actions");
    });

    cy.get('.ant-menu-item[data-key="bulk_actions"]').click();

    cy.contains("Bulk Actions");

    cy.contains('Upload').click();

    cy.contains("Bulk Upload");
    cy.contains("Click or drag file to this area to upload");
    cy.contains("Accepted Format: .txt, .xlsx or .csv files only");
  });

  it("Bulk Upload Issue Vouchers", () => {
    const fixtureName = 'sample_issue_vouchers.csv';

    Login();

    cy.wait(1000);
    cy.visit("https://dashboard.perxtech.io/dashboard/p/bulkaction");
    cy.get('.ant-btn.ant-btn-primary.ant-btn-lg').click();

    cy.get('.ant-select-selection__rendered').click();
    cy.contains('Issue Vouchers').click();
    cy.get('[type="file"]').attachFile(fixtureName);

    cy.get('.ant-modal-footer .ant-btn.ant-btn-primary').click();

    cy.wait(1000);
    cy.get('tbody tr:nth-child(1) td:nth-child(2)').should('have.text', fixtureName);
  });

  it("Bulk Upload Transactions", () => {
    const fixtureName = 'sample_upload_transactions.csv';

    Login();

    cy.wait(1000);
    cy.visit("https://dashboard.perxtech.io/dashboard/p/bulkaction");
    cy.get('.ant-btn.ant-btn-primary.ant-btn-lg').click();

    cy.get('.ant-select-selection__rendered').click();
    cy.contains('Upload Transactions').click();
    cy.get('[type="file"]').attachFile(fixtureName);

    cy.get('.ant-modal-footer .ant-btn.ant-btn-primary').click();

    cy.wait(1000);
    cy.get('tbody tr:nth-child(1) td:nth-child(2)').should('have.text', fixtureName);
  });

  it("Bulk Upload Users", () => {
    const fixtureName = 'sample_upload_users.csv';

    Login();

    cy.wait(1000);
    cy.visit("https://dashboard.perxtech.io/dashboard/p/bulkaction");
    cy.get('.ant-btn.ant-btn-primary.ant-btn-lg').click();

    cy.get('.ant-select-selection__rendered').click();
    cy.contains('Upload Users').click();
    cy.get('[type="file"]').attachFile(fixtureName);

    cy.get('.ant-modal-footer .ant-btn.ant-btn-primary').click();

    cy.wait(1000);
    cy.get('tbody tr:nth-child(1) td:nth-child(2)').should('have.text', fixtureName);
  });

  it("Bulk Upload Tries", () => {
    const fixtureName = 'sample_upload_tries.csv';

    Login();

    cy.wait(1000);
    cy.visit("https://dashboard.perxtech.io/dashboard/p/bulkaction");
    cy.get('.ant-btn.ant-btn-primary.ant-btn-lg').click();

    cy.get('.ant-select-selection__rendered').click();
    cy.contains('Upload Tries').click();
    cy.get('[type="file"]').attachFile(fixtureName);

    cy.get('.ant-modal-footer .ant-btn.ant-btn-primary').click();

    cy.wait(5000);
    cy.get('tbody tr:nth-child(1) td:nth-child(2)').should('have.text', fixtureName);
  });
});