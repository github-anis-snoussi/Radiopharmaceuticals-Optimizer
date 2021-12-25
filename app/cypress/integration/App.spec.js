/// <reference types="cypress" />

describe("RPO", () => {
    it("navigates", () => {
      cy.visit("/");
      cy.contains("Welcome");
    });
  });