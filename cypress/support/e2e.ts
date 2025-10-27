/// <reference types="cypress" />
import './commands';

// Common global configuration for Cypress e2e tests can go here.
Cypress.on('uncaught:exception', (err: Error, runnable?: any) => {
  // returning false here prevents Cypress from failing the test
  console.warn('Cypress caught uncaught exception:', err?.message || err);
  return false;
});
