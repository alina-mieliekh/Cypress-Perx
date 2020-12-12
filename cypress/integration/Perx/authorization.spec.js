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
    it('Log in as reward moderator', () => {

      Login();

      cy.intercept('GET', 'https://api.perxtech.io/v4/dash/authorizations').as('authorizations')

      cy.wait('@authorizations') 

      .then((interception) => {
        expect(interception.response.body.data.permissions.length).to.equal(1)
        expect(interception.response.body.data.permissions[0].resource_name).to.equal("rewards")
        expect(interception.response.body.data.permissions[0].actions[0]).to.equal("view")
        expect(interception.response.body.data.permissions[0].actions[1]).to.equal("edit")
        expect(interception.response.body.data.permissions[0].actions[2]).to.equal("activate")
        expect(interception.response.body.data.permissions[0].actions[3]).to.equal("deactivate")
      })
    
      cy.url().should('include', "/dashboard/p/rewards/list")
    })
    it('Moderator tries to access forbidden urls', () => {
        Login();

        cy.wait(1000)
        cy.url().should('equal', 'https://dashboard.perxtech.io/dashboard/p/rewards/list')
        cy.visit('https://dashboard.perxtech.io/dashboard/p/loyalty/list')
        cy.contains('403 Forbidden')

        cy.visit('https://dashboard.perxtech.io/dashboard/p/business_intelligence/overview')
        cy.contains('403 Forbidden')

        cy.visit('https://dashboard.perxtech.io/dashboard/p/merchants/list')
        cy.contains('403 Forbidden')

        cy.visit('https://dashboard.perxtech.io/dashboard/p/settings/general/media/list')
        cy.contains('403 Forbidden')

        cy.visit('https://dashboard.perxtech.io/dashboard/p/catalogues/list')
        cy.contains('403 Forbidden')

        cy.visit('https://dashboard.perxtech.io/dashboard/p/campaigns/list')
        cy.contains('403 Forbidden')

    })

    // This test case fails because of the bug.
    it('Moderator tries to access reports', () => {
        Login();

        cy.wait(1000)
        cy.url().should('equal', 'https://dashboard.perxtech.io/dashboard/p/rewards/list')
        cy.visit('https://dashboard.perxtech.io/dashboard/p/reports/downloads')
        cy.contains('403 Forbidden')
    }) 

    // This test case fails because of the bug.
    it('Moderator tries to access rules', () => {
        Login();

        cy.wait(1000)
        cy.url().should('equal', 'https://dashboard.perxtech.io/dashboard/p/rewards/list')
        cy.visit('https://dashboard.perxtech.io/dashboard/p/rules/list')
        cy.contains('403 Forbidden')
    }) 

    // This test case fails because of the bug.
    it('Moderator tries to access bulkaction', () => {
        Login();

        cy.wait(1000)
        cy.url().should('equal', 'https://dashboard.perxtech.io/dashboard/p/rewards/list')
        cy.visit('https://dashboard.perxtech.io/dashboard/p/bulkaction')
        cy.contains('403 Forbidden')
    }) 

    // This test case fails because of the bug.
    it('Moderator tries to access customers', () => {
        Login();

        cy.wait(1000)
        cy.url().should('equal', 'https://dashboard.perxtech.io/dashboard/p/rewards/list')
        cy.visit('https://dashboard.perxtech.io/dashboard/p/customers/list')
        cy.contains('403 Forbidden')
    }) 

    it('Moderator tries to create Campaigns' , () => {
        Login();

        cy.wait(1000)

        cy.request('POST', 'https://api.perxtech.io/v4/dash/user_sessions', {
            "email":"reward_admin@dashboard.com",
            "password":"reward_admin"
        })

            .then((response) => {
                authorization =  response.body.bearer_token;
                cy.request({
                    method: 'POST',
                    failOnStatusCode: false,
                    url: 'https://api.perxtech.io/v4/dash/campaigns',
                    
                        headers: {
                            authorization: 'Bearer ' + authorization},
                    
                    body: 
                    {
                        "timezone": "Asia/Kuala_Lumpur",
                        "begins_at": "2020-12-12T22:27:44+08:00",
                        "start_date": "2020-12-12T08:00:00+08:00",
                        "filter_type": [
                            "age"
                        ],
                        "birthmonth": [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December"
                        ],
                        "select_all_audience": true,
                        "campaign_referral_type": "user",
                        "outcomes": [
                            {
                                "type": "reward",
                                "id": 11553,
                                "name": "test editt",
                                "subtitle": null,
                                "description": null,
                                "meta": {
                                    "translatable_fields": [
                                        "name",
                                        "description",
                                        "subtitle",
                                        "steps_to_redeem_en",
                                        "steps_to_redeem_th",
                                        "steps_to_redeem_zh",
                                        "steps_to_redeem_vi",
                                        "terms_and_conditions_en",
                                        "terms_and_conditions_th",
                                        "terms_and_conditions_zh",
                                        "terms_and_conditions_vi"
                                    ]
                                },
                                "state": "active",
                                "merchant_name": null,
                                "begins_at": "2020-10-23T03:03:41.000Z",
                                "ends_at": null,
                                "images": [],
                                "activatable": false,
                                "deactivatable": true,
                                "is_private": false,
                                "is_system": false,
                                "og_title": "test edit",
                                "og_description": null,
                                "og_image": {
                                    "url": null
                                },
                                "al_ios_url": "#",
                                "al_android_url": "3",
                                "og_url": null,
                                "categories": [],
                                "transaction_rule": null,
                                "name_en": "test editt",
                                "name_th": null,
                                "name_zh": null,
                                "name_vi": null,
                                "description_en": null,
                                "description_th": null,
                                "description_zh": null,
                                "description_vi": null,
                                "subtitle_en": null,
                                "subtitle_th": null,
                                "subtitle_zh": null,
                                "subtitle_vi": null,
                                "steps_to_redeem_en": null,
                                "steps_to_redeem_th": null,
                                "steps_to_redeem_zh": null,
                                "steps_to_redeem_vi": null,
                                "terms_and_conditions_en": null,
                                "terms_and_conditions_th": null,
                                "terms_and_conditions_zh": null,
                                "terms_and_conditions_vi": null,
                                "lifetime_rewards_available": null,
                                "lifetime_max_rewards": null,
                                "voucher_codes_count": 0,
                                "transaction_expires_at": "2020-10-05T05:00:00.000Z",
                                "transaction_validity_period_type": "period",
                                "transaction_expires_in_units": null,
                                "transaction_expires_in_period": "day",
                                "transaction_issues_at": "2020-10-23T03:03:41.000Z",
                                "grace_time_in_units": null,
                                "grace_time_in_period": "day",
                                "code_generation_method": "nocode",
                                "tags": [],
                                "ordering": 1
                            }
                        ],
                        "account_interval_period": "day",
                        "display_properties": {},
                        "auto_enrol_users": true,
                        "issue_all": false,
                        "questions": [],
                        "al_ios_url": "#",
                        "al_android_url": "3",
                        "og_title": "TestTest",
                        "name_en": "TestTest",
                        "description_en": "<p>Test</p>",
                        "terms_and_conditions_en": "<p>Test</p>",
                        "hideDurationEndDate": false,
                        "end_date": "2020-12-14T08:00:00+08:00",
                        "tag_ids": [
                            1
                        ],
                        "categories": [
                            35
                        ],
                        "labels": [
                            241
                        ],
                        "merchant_account_id": 18024,
                        "gender": "1",
                        "from_age": 18,
                        "to_age": 60,
                        "include_age_group_opt": "include",
                        "age_filter": [
                            {
                                "fromAge": 18,
                                "toAge": 60,
                                "type": "include"
                            }
                        ],
                        "filters": {
                            "age": [
                                {
                                    "type": "age",
                                    "criteria": {
                                        "gteq": 18,
                                        "lteq": 60,
                                        "policy": "include"
                                    }
                                }
                            ]
                        },
                        "include_audience_ids": [
                            1
                        ],
                        "selection_for_audience_list": [],
                        "total_stamps": 8,
                        "campaign_type": "give_reward",
                        "rewards": [
                            {
                                "type": "reward",
                                "id": 11553,
                                "name": "test editt",
                                "subtitle": null,
                                "description": null,
                                "meta": {
                                    "translatable_fields": [
                                        "name",
                                        "description",
                                        "subtitle",
                                        "steps_to_redeem_en",
                                        "steps_to_redeem_th",
                                        "steps_to_redeem_zh",
                                        "steps_to_redeem_vi",
                                        "terms_and_conditions_en",
                                        "terms_and_conditions_th",
                                        "terms_and_conditions_zh",
                                        "terms_and_conditions_vi"
                                    ]
                                },
                                "state": "active",
                                "merchant_name": null,
                                "begins_at": "2020-10-23T03:03:41.000Z",
                                "ends_at": null,
                                "images": [],
                                "activatable": false,
                                "deactivatable": true,
                                "is_private": false,
                                "is_system": false,
                                "og_title": "test edit",
                                "og_description": null,
                                "og_image": {
                                    "url": null
                                },
                                "al_ios_url": "#",
                                "al_android_url": "3",
                                "og_url": null,
                                "categories": [],
                                "transaction_rule": null,
                                "name_en": "test editt",
                                "name_th": null,
                                "name_zh": null,
                                "name_vi": null,
                                "description_en": null,
                                "description_th": null,
                                "description_zh": null,
                                "description_vi": null,
                                "subtitle_en": null,
                                "subtitle_th": null,
                                "subtitle_zh": null,
                                "subtitle_vi": null,
                                "steps_to_redeem_en": null,
                                "steps_to_redeem_th": null,
                                "steps_to_redeem_zh": null,
                                "steps_to_redeem_vi": null,
                                "terms_and_conditions_en": null,
                                "terms_and_conditions_th": null,
                                "terms_and_conditions_zh": null,
                                "terms_and_conditions_vi": null,
                                "lifetime_rewards_available": null,
                                "lifetime_max_rewards": null,
                                "voucher_codes_count": 0,
                                "transaction_expires_at": "2020-10-05T05:00:00.000Z",
                                "transaction_validity_period_type": "period",
                                "transaction_expires_in_units": null,
                                "transaction_expires_in_period": "day",
                                "transaction_issues_at": "2020-10-23T03:03:41.000Z",
                                "grace_time_in_units": null,
                                "grace_time_in_period": "day",
                                "code_generation_method": "nocode",
                                "tags": [],
                                "ordering": 1
                            }
                        ],
                        "state": "active"
                    }
                  })

            })
          
        .then((response) => {
            expect(response.body.message).to.be.equal("User does not have rights to this object")
            expect(response.status).to.be.equal(403)

        })
    })
})