import * as ctx from  '../../../../quasar.conf.js'

describe('Landing', () => {
  beforeEach(() => {
    // cy.visit('/')
  })

  it('carousel home visible', () => {
    cy.visit('/')

    cy.get('.q-dialog .q-carousel__slide').should('be.visible')
  })

  it('carousel home has 3 slides', () => {
    cy.visit('/')

    cy.get('#next-slide').click()
    cy.wait(300)
    cy.get('#next-slide').click()
    cy.wait(300)
    cy.get('#next-slide').click()
    cy.wait(300)
    cy.get('.q-dialog .q-carousel__slide').should('not.be.visible')
    cy.wait(300)
    cy.visit('/')
    cy.get('.q-dialog .q-carousel__slide').should('not.be.visible')
  })

  it('carousel home appear only the first time', () => {
    cy.visit('/')

    cy.get('.q-dialog .q-carousel__slide').should('be.visible')
    cy.get('body').click('topRight')
    cy.get('.q-dialog .q-carousel__slide').should('not.be.visible')
  })
})