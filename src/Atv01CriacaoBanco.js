/*
  * [ATIVIDADE 1 - Criação do banco]
  *
  * Crie um aplicativo Express em uma variável chamada app
  * que, ao ser inicializado, cria um banco de dados chamado
  * "beyblade.db". Siga o exemplo no arquivo "app.js" para
  * referência.
  *
  * Após criar o banco de dados, crie uma tabela chamada 
  * "beyblades" com as colunas abaixo:
  *
  * id, com propriedades INTEGER, PRIMARY KEY e AUTOINCREMENT
  * nome, com propriedades TEXT, NOT NULL e UNIQUE
  * lamina, com propriedade TEXT,
  * catraca, com propriedade TEXT,
  * ponta, com propriedade TEXT,
  * participante, com propriedades TEXT, NOT NULL e UNIQUE
  *
  * Após isso, você deve criar uma rota "GET" no endereço "/"
  * que envia o arquivo "indexAtv.html".
  *
  * Por fim, o servidor deve ouvir a porta 3000.
  *
  * Ao final deste arquivo, use "module.exports = app" para
  * exportar o objeto do servidor para os testes automatizados.
  */

const porta = 3000;
const express = require('express'),
const req = require('express/lib/request')
const app = express(),
const path = require('path'),
const sql = require('sqlite3').verbose(),
const db = new sql.Database(
  'beyblade.db', (erro) => {
    if(erro){
      console.log("Erro ao criar o banco de dados beyblade.db, ", erro.message)
    } else{
      console.log("Sucesso ao criar o banco de dados beyblade.db")
    }
  }
)

db.run(
  `CREATE TABLE IF NOT EXISTS beyblade(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    lamina TEXT,
    catraca TEXT,
    ponta TEXT,
    participante TEXT NOT NULL UNIQUE
  )`, (erro) => {
    if(erro){
      console.log("Erro ao criar a tabela beyblade, ", erro.message)
    } else {
      console.log("Tabela criada com sucesso")

      db.run(
        `INSERT INTO beyblade (nome, lamina, catraca, ponta, participante)
        VALUES
        (
            'Dran Sword',
            'Dran Sword',
            '3-60',
            'Flat',
            'João'
        ),
        (
            'Hells Scythe',
            'Hells Scythe',
            '4-80',
            'Ball',
            'Maria'
        )`, (erro) => {
          if(erro){
            console.log("Erro ao inserir na tabela beyblade.")
          } else {
            console.log("Inserido com sucesso.")
          }
        }
      )
    }
  }
)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexAtv.html'))
})

app.listen(porta, () => {
  console.log("App rodando na porta ", porta)
})

module.exports = app