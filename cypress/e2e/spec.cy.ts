describe('Movie App (mockad data)', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'http://omdbapi.com/?apikey=416ed51a&s=Harry*',
      { fixture: 'example.json' }
    ).as('getMovies');
    cy.intercept(
      'GET',
      'http://omdbapi.com/?apikey=416ed51a&s=asldkfjalskdfj*',
      { body: { Response: "False", Error: "Movie not found!" } }
    ).as('getNoMovies');
    cy.visit('http://localhost:5173');
  });

  it('visar sökresultat när man söker på en film (mock)', () => {
    cy.get('#searchText').type('Harry Potter');
    cy.get('#searchForm').submit();
    cy.wait('@getMovies');
    cy.get('.movie').should('have.length.greaterThan', 0);
  });

  it('visar ett felmeddelande om ingen film hittas (mock)', () => {
    cy.get('#searchText').type('asldkfjalskdfj');
    cy.get('#searchForm').submit();
    cy.wait('@getNoMovies');
    cy.contains('Inga sökresultat').should('exist');
  });
});

describe('Movie App (riktiga API:et)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('visar sökresultat när man söker på en film (API)', () => {
    cy.get('#searchText').type('Harry Potter');
    cy.get('#searchForm').submit();
    cy.get('.movie', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('visar ett felmeddelande om ingen film hittas (API)', () => {
    cy.get('#searchText').type('asldkfjalskdfj');
    cy.get('#searchForm').submit();
    cy.contains('Inga sökresultat', { timeout: 10000 }).should('exist');
  });
}); 