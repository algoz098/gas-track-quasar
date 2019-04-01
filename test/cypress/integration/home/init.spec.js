import * as ctx from  '../../../../quasar.conf.js'
import {LocalStorage} from 'quasar'

describe('Landing', () => {
  beforeEach(() => {
    window.localStorage.setItem('carouselHome', true)
  })

  it('assert that <title> is correct', () => {
    cy.visit('/')
    cy.title().should('include', 'Gas Track Quasar')
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
    cy.get('#total input').should('have.value', '0.40')
    cy.get('#save-btn').click()

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

    cy.get('#add-track-btn').click()
    cy.get('#km_actual input').should('have.value', '300')
    cy.get('#total input').should('have.value', '4.00')
    cy.get('#save-btn').click()

    cy.get('.q-item__label').contains('Wheeled: 200Kms')
    cy.get('.q-item__label').contains('Lts Total: 3.00')
    cy.get('.q-item__label').contains('Effectness: 100.00km/lt')

    cy.get('#create-first-track').should('not.be.visible')
  })

  it('delete items', () => {
    cy.visit('/')

    cy.get('#add-track-btn').click()
    cy.get('#km_actual input').type('100')
    cy.get('#lts_add input').type('100')
    cy.get('#price input').type('400')
    cy.get('#total input').should('have.value', '4.00')
    cy.get('#save-btn').click()
    cy.wait(300)

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
    cy.wait(300)

    cy.get('#track_0').click()
    cy.wait(300)
    cy.get('.q-item__section').contains('Edit this').click()
    cy.get('#km_actual input').clear().type('200')
    cy.get('#save-btn').click()

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

    cy.get('#clear-list').click()
    cy.get('.q-dialog').contains('This will clear the tracks you have, but just in you device')
    cy.get('.q-btn').contains('OK').click()
    cy.get('.q-item__label').should('not.be.visible')

  })
})