/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Get the Redux store exposed on window for tests
       */
      getStore(): Chainable<any>;
    }
  }
}

export {};
