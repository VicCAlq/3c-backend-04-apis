/*
  * [ATIVIDADE 2 - Selecionar Todos]
  *
  * Copie o servidor feito na atividade 01, e acrescente uma
  * rota "GET" para o endereço "/api/beyblade" após a rota
  * "/" criada no exercício anterior.
  *
  * Esta rota deve executar o código SQL que retorna
  * todos os itens da tabela "beyblades" criada no exercício
  * anterior, e envia o resultado para o site em uma mensagem
  * no formato JSON. Siga os exemplos no arquivo "app.js"
  * para entender melhor.
  *
  * Ao final deste arquivo, use "module.exports = app" para
  * exportar o objeto do servidor para os testes automatizados.
  */

const porta = 3000;
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const sql = require('sqlite3').verbose();
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

app.get('/api/beyblade', (req, res) => {
  db.all(
    `SELECT * FROM beyblade`,
    [],
    (erro, itensTabelaBeyblade) => {
      if(erro){
        res.status(400).json({ error: erro.message })
        return
      } else {
        res.status(200).json({
          message: "Requisição feita com sucesso",
          data: itensTabelaBeyblade
        })
      }
    }
  )
})

app.listen(porta, () => {
  console.log("App rodando na porta ", porta)
})

module.exports = app