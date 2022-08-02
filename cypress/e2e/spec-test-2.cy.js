/// <reference types="Cypress"/>

describe('Primeiro Teste Cypress', () => {

  beforeEach(function(){
    cy.viewport(410,860) // muda o tamanho da tela
    cy.visit('../src/index.html')
  })

  it('Verifica o título da aplicação.', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Texto muuuuuuuuuuito looooooooongo, muuuuuuito looooooongo, muito longo, muito longoooooooooooooooooo.'

    cy.get('#firstName').type('Alan')
    cy.get('#lastName').type('Leandro')
    cy.get('#email').type('aleandr1@ford.com')
    cy.get('#open-text-area').type(longText, {delay:0}) //digita sem delay
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')
  })

  it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Alan')
    cy.get('#lastName').type('Leandro')
    cy.get('#email').type('aleandr1@ford,com') //email inválido
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })

  it('campo telefone continua vazio quando preenchida com valor não numérico', () => {
    cy.get('#phone').type('abcdefghijk').should('have.value', '')
  });

  it('Exibe mensagem de erro quando o telefone se torna obrigatório e não é preenchido', () => {
    cy.get('#firstName').type('Alan')
    cy.get('#lastName').type('Leandro')
    cy.get('#email').type('aleandr1@ford.com') 
    cy.get('#phone-checkbox').check() //ativa campo telefone como obrigatório
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  });

  it('Preenche e limpa os campos nome, sobrenome, email, e telefone', () => {
    cy.get('#firstName').type('Alan').should('have.value', 'Alan').clear().should('have.value','') 
    cy.get('#lastName').type('Leandro').should('have.value', 'Leandro').clear().should('have.value','')
    cy.get('#email').type('aleandr1@ford.com').should('have.value', 'aleandr1@ford.com').clear().should('have.value','')
    cy.get('#phone').type('1234567890').should('have.value', '1234567890').clear().should('have.value','')
  });

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click() //usando o comando contains

    cy.get('.error').should('be.visible')
  });

  it('Envia o formulário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')
  });

  // **** CAP 4 - Combo box****
  it('Seleciona um produto (Youtube) pro seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  });

  it('Seleciona um produto (Mentoria) pro seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  });

  it('Seleciona um produto (Mentoria) pro seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  });

  it('Seleciona um produto (blog) pro seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  });

  // **** CAP 5 - Radio ****
  it('Marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  });

  it('Marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(($radio)=>{ // passa por cada elemento
        cy.wrap($radio).check() // compacta o elemento para ser usado - 
        cy.wrap($radio).should('be.checked')
      })
  });

  // **** CAP 6 - Checkbox ****
  it('Marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  });

  // **** CAP 7 - Upload files ****
  it('Seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"')
      .should('not.have.value') 
      .selectFile('./cypress/fixtures/example.json')
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  it('Seleciona um arquivo simulando drag-drop', () => {
    cy.get('input[type="file"')
      .should('not.have.value') 
      .selectFile('./cypress/fixtures/example.json', {action:'drag-drop'})
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  it('Seleciona um arquivo utilizando uma fixture para qual foi dada um alias', () => {
    cy.fixture("example.json").as('sampleFile') //nomeando uma alias
    cy.get('input[type="file"')
      .should('not.have.value') 
      .selectFile('@sampleFile')
      .should(($input) => {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  });

  // **** CAP 8 - Multiplas Abas ****
  it('Verifica a politica de privacidade abre em outra aba sem a necessidade de um click', () => {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  });

  it('Acessa a página de politica de privacidade removendo o atributo target', () => {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')// remove o tributo de um elemento
      .click()

    cy.contains('Talking About Testing').should('be.visible')
  });

  it.only('Testa a página da política de forma independente', () => {
    cy.visit('../src/privacy.html')

    cy.contains('Talking About Testing').should('be.visible')
  });

  // **** CAP 9 - Simulando o viewport de um dispositivo móvel ****
  //npx cypress run --browser chrome               [rodar modo headless ]

  // **** CAP 10 - Documentação ****
  /*
    - Descrição do projeto
    - Pré-requisitos(Node, npm git , etc)
    - Passos para instalação das dependencias
    - Passos para rodar os testes
    - Qualquer outra informação pertinente
  */

    // **** CAP 11 - Integração continua ****


})