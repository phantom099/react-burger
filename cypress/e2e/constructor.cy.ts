describe("Constructor drag-and-drop flow", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/ingredients");
    cy.visit("/");
    cy.get('[class^="burger-ingredients_draggable"]', { timeout: 10000 }).should("exist");
  });

  it("user can drag bun and main to constructor and create order", () => {
    cy.get('[class^="burger-ingredients_draggable"]').contains("булка").as("bun");
    cy.get('[class^="burger-ingredients_draggable"]').not(':contains("булка")').first().as("main");

    const dataTransfer = new DataTransfer();

    cy.get("@bun").trigger("dragstart", { dataTransfer });
    cy.get(
      '[class^="burger-constructor_constburger_constructor__TXPjr"]'
    ).trigger("drop", {
      dataTransfer,
    });

    cy.get("@main").trigger("dragstart", { dataTransfer });
    cy.get(
      '[class^="burger-constructor_constburger_constructor__TXPjr"]'
    ).trigger("drop", {
      dataTransfer,
    });

    cy.get("@main").trigger("dragstart", { dataTransfer });
    cy.get(
      '[class^="burger-constructor_constburger_constructor__TXPjr"]'
    ).trigger("drop", {
      dataTransfer,
    });

    cy.get('[class^="burger-constructor_constructorItem__pBQwl"]').should(
      "have.length.at.least",
      2
    );

    cy.contains("Оформить заказ").click();

    // Если появляется форма авторизации, заполняем её
    cy.location('pathname', { timeout: 10000 }).then((path) => {
      if (path.includes('login')) {
        cy.get('input[type="email"]').type('testt@test.com');
        cy.get('input[type="password"]').type('123456');
        cy.get('button').contains('Войти').click();
      }
    });

    cy.get('button').contains('Оформить заказ').click();

    cy.wait(20000);
    // После авторизации должен появиться модал с номером заказа
    cy.get("body").find('[class*="number"]', { timeout: 20000 }).should("exist");
  });
});