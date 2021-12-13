/// <reference types="Cypress"/>
import testData from '../test-config/test-config';

describe('Stub request test cases', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.get('#name').type(testData.name)
        cy.get('#email').type(testData.email)
        cy.get('#subject').type(testData.subject)
        cy.get('#message').type(testData.message)
    })

    it('Should return Internal server error in response', () => {
        cy.intercept('POST','/v2/tickets/new',{
            statusCode:500,
            body:{
                error:'Internal server error'
            }
        }).as('getServerFailure')
        cy.get('button').contains('Submit').click()
        cy.wait('@getServerFailure')
        .then(inter => {
            cy.log(JSON.stringify(inter))
            expect(inter.response.statusCode).to.equal(500)
        })
    })

    it('Should return data in response correctly', () => {
        cy.intercept('POST','/v2/tickets/new',{
            statusCode:200,
            body:{
                id:'ABCD'
            }
        }).as('getServerSuccess')
        cy.get('button').contains('Submit').click()
        cy.wait("@getServerSuccess")
        .then(inter => {
            cy.log(JSON.stringify(inter))
            expect(inter.response.body.id).to.equal('ABCD')
            expect(inter.response.statusCode).to.equal(200)
        })
    })
})