/// <reference types = "cypress"/>

describe('first tests', () => {

  beforeEach('open application', () => {
    cy.intercept('GET', '**/tags', { fixture: 'tags.json' })
    cy.login()
  })

  it('verify correct request and response', () => {

    cy.intercept('POST', '**/articles').as('postArticles')

    cy.wait(500)
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('Title')
    cy.get('[formcontrolname="description"]').type('Description')
    cy.get('[formcontrolname="body"]').type('Article body')
    cy.contains('Publish Article').click()

    cy.wait(500)

    cy.wait('@postArticles').then(({ request, response }) => {
      expect(response.statusCode).to.equal(200)
      expect(request.body.article.body).to.equal('Article body')
      expect(response.body.article.description).to.equal('Description')
    })
  })

  it('should return tags', () => {
    cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'testing')
  })

  it('should verify like funtionality', () => {
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })
    cy.intercept('GET', '**/articles/feed*', '{"articles":[],"articlesCount":0}')

    cy.contains('Global Feed').click()

    cy.get('app-article-list button').then(listOfButtons => {
      expect(listOfButtons[0]).to.contain(1)
      cy.wrap(listOfButtons[1]).should('contain', 10)
    })

    // we do this so we  don't hit the real api instead we hit the mock
    cy.fixture('articles').then(file => {
      const { slug } = file.articles[1]
      cy.intercept('POST', `**/articles/${slug}/favorite`, file)
    })

    cy.get('app-article-list button').eq(1).click()
      .should('contain', 11)

  })

  it('should delete article from api', () => {

    const article = {
      "article":
      {
        "tagList": [], "title": "last request from an api Final",
        "description": "description",
        "body": "testing api cypress"
      }
    }

    cy.get('@token').then(token => {

      cy.request({
        url: 'https://conduit.productionready.io/api/articles/',
        headers: { 'Authorization': `Token ${token}` },
        method: 'POST',
        body: article
      }).then(res => {
        expect(res.status).to.equal(200)
      })

      cy.contains('Global Feed').click()
      cy.wait(500)
      cy.get('.article-preview').first().click()
      cy.get('.article-actions').contains('Delete Article').click()


      cy.request({
        url: 'https://conduit.productionready.io/api/articles?limit=10&offset=0',
        headers: { 'Authorization': `Token ${token}` },
        method: 'GET'
      }).its('body').then(body => {
        expect(body.articles[0].title).not.to.eq("last request from an api Final")
      })
    })
  })
})