/// <reference types="cypress" />
// Custom Cypress commands can be added here.
// For this project we use the exposed `window.store` to seed state for tests.

// Return type annotation helps TS infer the chainable return value
Cypress.Commands.add('getStore', (): Cypress.Chainable<any> => cy.window().its('store'));
