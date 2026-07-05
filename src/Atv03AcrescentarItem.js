/*
  * [ATIVIDADE 3 - Acrescentar Item]
  *
  * Copie o servidor feito na atividade 02, e acrescente uma
  * rota "GET" para o endereço "/api/beyblade/cadastrar" após a rota
  * "/api/beyblade" criada no exercício anterior.
  *
  * Esta rota é executada quando o formulário do site é preenchido,
  * e ao ser executada, esta rota deve armazenar as informações
  * preenchidas no formmulário em variáveis (estas informações
  * existem dentro do objeto req.query).
  *
  * Após armazenadas estas variáveis, deve ser executado o comando
  * SQL que permite a inserção de valores novos no banco de dados.
  * Confira como foi feito no app.js para referência.
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
  `CREATE TABLE IF NOT EXISTS beyblades(
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
    `SELECT * FROM beyblades`,
    [],
    (erro, itensTabelaBeyblade) => {
      if(erro){
        res.status(400).json({ error: erro.message })
        return
      } else {
        res.json({ itensTabelaBeyblade })
      }
    }
  )
})

app.get('/api/beyblade/cadastrar', (req, res) => {
  const { nome, lamina, catraca, ponta, participante } = req.query;

  db.all(
    `INSERT INTO beyblades (nome, lamina, catraca, ponta, participantes) VALUES (?, ?, ?, ?, ?)`,
    [nome, lamina, catraca, ponta, participante]
  )
})

app.listen(porta, () => {
  console.log("App rodando na porta ", porta)
})

module.exports = app