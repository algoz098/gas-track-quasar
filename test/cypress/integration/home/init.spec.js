import * as ctx from  '../../../../quasar.conf.js'
const apiBase = '/api/v1/'

const autoRegisterRoute = {method: 'GET', url: `${apiBase}auto-register*`, response: {api_token: 'test'} }
const getRoute = {method: 'GET', url: `${apiBase}gas-track*`, response: {}}
const saveRoute = {method: 'POST', url: `${apiBase}gas-track/*`, response: {}}
const voteRoute = {method: 'POST', url: `${apiBase}votes*`, response: {}}
const deleteRoute = {method: 'POST', url: `${apiBase}gas-track/*/delete*`, response: {}}

describe('Landing', () => {
  beforeEach(() => {
    cy.server()

    cy.route(autoRegisterRoute).as('autoRegister')
    cy.route(getRoute).as('get')
    cy.route(saveRoute).as('save')
    cy.route(voteRoute).as('vote')
    cy.route(deleteRoute).as('delete')
  })

  it('assert that <title> is correct',async  () => {
    cy.visit('/')

    cy.wait('@autoRegister').then((xhr) => {
      assert.isNotNull(xhr.response.header.Authorization)

      cy.wait('@get').then((xhr) => {
        cy.title().should('include', 'Gas Track Quasar')
      })
    })
  })

  it('show "create first track"', () => {

    cy.get('#create-first-track').click()

    cy.get('#save-btn').contains('Create!')
  })

  it('be able to add new track', () => {
    cy.visit('/#/tracks/new')
    cy.get('#km_actual input').type('100')
    cy.get('#lts_add input').type('10')
    cy.get('#price input').type('400')
    cy.wait(400)
    cy.get('#total input').should('have.value', '0.40')
    cy.get('#save-btn').click()
    cy.wait(400)
    
    cy.wait('@autoRegister').then((xhr) => {
      assert.isNotNull(xhr.response.body.data)
    })

    cy.get('.q-item__label').contains('$0.40 on')
    cy.get('.q-item__label').contains('at 100kms add 0,10Lts')
    cy.get('#create-first-track').should('not.be.visible')
  })

  it('calculate total', () => {
    cy.visit('/')

    cy.get('#add-track-btn').click()
    cy.get('#km_actual input').type('100')
    cy.get('#lts_add input').type('100')
    cy.get('#price input').type('400')
    cy.get('#total input').should('have.value', '4.00')
    cy.get('#save-btn').click()
    cy.wait(300)
    
    cy.get('#add-track-btn').click()
    cy.get('#km_actual input').type('200')
    cy.get('#total input').should('have.value', '4.00')
    cy.get('#save-btn').click()
    cy.wait(300)
    
    cy.get('.q-item__label').contains('$4.00 on').click()
    cy.wait(300)
    cy.get('.q-item__section').contains('Recalculate km/lt').click({force: true})
     
    cy.get('.q-item__section .q-item__label').contains('100 km/lt')
    cy.get('.q-item__label').contains('Lts Total: 2.00')
    cy.get('.q-item__label').contains('Effectness: 100.00km/lt')

    cy.get('#create-first-track').should('not.be.visible')
  })

  it('delete items', () => {
    cy.visit('/')
    cy.wait('@get')

    cy.get('#add-track-btn').click()

    cy.get('#km_actual input').type('100')
    cy.get('#lts_add input').type('100')
    cy.get('#price input').type('400')
    cy.get('#total input').should('have.value', '4.00')
    cy.get('#save-btn').click()
    cy.wait('@save')

    cy.get('#track_0').click()
    cy.get('.q-item__section').contains('Delete this').click()
    

    cy.get('.q-item__label').should('not.be.visible')

  })

  it('edit itens', () => {
    cy.visit('/')

    cy.get('#add-track-btn').click()
    cy.get('#km_actual input').type('100')
    cy.get('#lts_add input').type('100')
    cy.get('#price input').type('400')
    cy.get('#total input').should('have.value', '4.00')
    cy.get('#save-btn').click()
    cy.wait(400)

    cy.get('#track_0').click()
    cy.wait(400)
    cy.get('.q-item__section').contains('Edit this').click({force: true})
    cy.get('#km_actual input').clear().type('200')
    cy.get('#save-btn').click()
    cy.wait(300)

    cy.get('.q-item__label').contains('$4.00 on').click()
    cy.wait(300)
    cy.get('.q-item__section').contains('Recalculate km/lt').click({force: true})
    
    cy.wait('@autoRegister').then((xhr) => {
      assert.isNotNull(xhr.response.body.data)
    })

    cy.get('.q-item__label').contains('at 200kms add 1,00Lts')
  })

  it('clear list', () => {
    cy.visit('/')

    cy.get('#add-track-btn').click()
    cy.get('#km_actual input').type('100')
    cy.get('#lts_add input').type('100')
    cy.get('#price input').type('400')
    cy.get('#total input').should('have.value', '4.00')
    cy.get('#save-btn').click()
    cy.wait(300)
    cy.get('.q-item__label').contains('at 100kms add 1,00Lts')

    cy.get('#show-side-menu').click()
    cy.get('#clear-list').click()
    cy.get('.q-dialog').contains('This will clear the tracks you have, but just in you device')
    cy.get('.q-btn').contains('OK').click()
    cy.get('.q-item__label').should('not.be.visible')
  })

  it('show my uid', () => {
    cy.visit('/')

    cy.get('#show-side-menu').click()
    cy.get('#show-uid').click()
    cy.get('.q-dialog').contains('Your UID')
    cy.get('.q-btn').contains('OK').click()
    cy.get('.q-dialog').should('not.be.visible')
  })

  it('rate us', () => {
    cy.visit('/')

    cy.get('#show-side-menu').click()
    cy.get('#show-rate-us').click()
    cy.wait(200)
    cy.get('.q-dialog').contains('5 stars?')
    cy.get('.q-rating__icon').first().click()
    cy.get('#rate-us-comment textarea').type('test')
    
    cy.get('.q-btn').contains('OK').click()
       
    cy.wait('@vote').then((xhr) => {
      assert.isNotNull(xhr.response.body.data)
    })

    cy.get('.q-dialog').should('not.be.visible')
  })
})