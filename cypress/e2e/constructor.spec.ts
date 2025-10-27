/// <reference types="cypress" />
/* eslint-disable @typescript-eslint/no-floating-promises */

/// <reference types="cypress" />

describe('Constructor flow', () => {
  beforeEach(() => {
    // Stub ingredient list and order creation
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/orders', { statusCode: 200, body: { success: true, order: { number: 123 } } }).as('createOrder');
    cy.visit('/');
    // return the wait so linter/test runner knows we've handled the promise
    return cy.wait('@getIngredients');
  });

  it('adds bun and main via store, creates order and shows modal with order number', () => {
    // Use exposed window.store to seed auth and constructor state
    cy.window().its('store').then((store: any) => {
      // set user as authenticated
      store.dispatch({ type: 'user/setUser', payload: { email: 'cypress@test', name: 'Cypress' } });
      const items = store.getState().ingredients.items;
      if (!items || items.length === 0) {
        throw new Error('No ingredients available for test');
      }
      const bun = items.find((i: any) => i.type === 'bun');
      const main = items.find((i: any) => i.type !== 'bun');
      // add bun and a main to constructor
      store.dispatch({ type: 'constructor/addIngredient', payload: bun });
      store.dispatch({ type: 'constructor/addIngredient', payload: main });
    });

    // Click the order button and verify modal shows order number
    // Click the order button and return the wait chain; assert inside .then to make linter happy
    cy.contains('Оформить заказ').click();
    return cy.wait('@createOrder').then(() => cy.get('.number').should('contain', '123'));
  });
});
