import campaign from "../../fixtures/campaign.json";

let authorization;

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

function Login() {
  cy.visit("https://dashboard.perxtech.io/dashboard/signin");
  cy.get("#email").type("reward_admin@dashboard.com");

  cy.get("#password").type("reward_admin");
  cy.contains("Login").click();
}

describe("Authorization", () => {
  it("Log in as reward moderator", () => {
    Login();

    cy.intercept("GET", "https://api.perxtech.io/v4/dash/authorizations").as("authorizations");

    cy.wait("@authorizations").then((interception) => {
      expect(interception.response.body.data.permissions.length).to.equal(1);
      expect(interception.response.body.data.permissions[0].resource_name).to.equal("rewards");
      expect(interception.response.body.data.permissions[0].actions[0]).to.equal("view");
      expect(interception.response.body.data.permissions[0].actions[1]).to.equal("edit");
      expect(interception.response.body.data.permissions[0].actions[2]).to.equal("activate");
      expect(interception.response.body.data.permissions[0].actions[3]).to.equal("deactivate");
    });

    cy.url().should("include", "/dashboard/p/rewards/list");
  });
  it("Moderator tries to access forbidden urls", () => {
    Login();

    cy.wait(1000);
    cy.url().should("equal", "https://dashboard.perxtech.io/dashboard/p/rewards/list");
    cy.visit("https://dashboard.perxtech.io/dashboard/p/loyalty/list");
    cy.contains("403 Forbidden");

    cy.visit("https://dashboard.perxtech.io/dashboard/p/business_intelligence/overview");
    cy.contains("403 Forbidden");

    cy.visit("https://dashboard.perxtech.io/dashboard/p/merchants/list");
    cy.contains("403 Forbidden");

    cy.visit("https://dashboard.perxtech.io/dashboard/p/settings/general/media/list");
    cy.contains("403 Forbidden");

    cy.visit("https://dashboard.perxtech.io/dashboard/p/catalogues/list");
    cy.contains("403 Forbidden");

    cy.visit("https://dashboard.perxtech.io/dashboard/p/campaigns/list");
    cy.contains("403 Forbidden");
  });

  // This test case fails because of the bug.
  it("Moderator shouldn't have access to reports", () => {
    Login();

    cy.wait(1000);
    cy.url().should("equal", "https://dashboard.perxtech.io/dashboard/p/rewards/list");
    cy.visit("https://dashboard.perxtech.io/dashboard/p/reports/downloads");
    cy.contains("403 Forbidden");
  });

  // This test case fails because of the bug.
  it("Moderator shouldn't have access to rules", () => {
    Login();

    cy.wait(1000);
    cy.url().should("equal", "https://dashboard.perxtech.io/dashboard/p/rewards/list");
    cy.visit("https://dashboard.perxtech.io/dashboard/p/rules/list");
    cy.contains("403 Forbidden");
  });

  // This test case fails because of the bug.
  it("Moderator shouldn't have access to bulkaction", () => {
    Login();

    cy.wait(1000);
    cy.url().should("equal", "https://dashboard.perxtech.io/dashboard/p/rewards/list");
    cy.visit("https://dashboard.perxtech.io/dashboard/p/bulkaction");
    cy.contains("403 Forbidden");
  });

  // This test case fails because of the bug.
  it("Moderator shouldn't have access to customers", () => {
    Login();

    cy.wait(1000);
    cy.url().should("equal", "https://dashboard.perxtech.io/dashboard/p/rewards/list");
    cy.visit("https://dashboard.perxtech.io/dashboard/p/customers/list");
    cy.contains("403 Forbidden");
  });

  it("Moderator shouldn't have access to Campaigns", () => {
    Login();

    cy.wait(1000);

    cy.request("POST", "https://api.perxtech.io/v4/dash/user_sessions", {
      email: "reward_admin@dashboard.com",
      password: "reward_admin",
    })

      .then((response) => {
        authorization = response.body.bearer_token;
        cy.request({
          method: "POST",
          failOnStatusCode: false,
          url: "https://api.perxtech.io/v4/dash/campaigns",

          headers: {
            authorization: "Bearer " + authorization,
          },

          body: campaign,
        });
      })

      .then((response) => {
        expect(response.body.message).to.be.equal("User does not have rights to this object");
        expect(response.status).to.be.equal(403);
      });
  });
});
