/*
  * [ATIVIDADE 4 - Eliminar Item]
  *
  * Copie o servidor feito na atividade 03, e acrescente uma
  * rota "DLETE" para o endereço "/api/beyblade/remover" após a rota
  * "/api/beyblade/cadastrar" criada no exercício anterior.
  *
  * Esta rota é executada quando, na tabela de beyblades cadastradas,
  * o botão "Remover" é clicado. Esta rota deve armazenar as o id
  * da beyblade a ser removida (desta vez, por não ser uma rota do
  * tipo GET, essa informação não existe dentro de req.query, mas sim
  * dentro de req.params), e repassar esse id para o comando
  * SQL que realiza a remoção de itens da tabela. Confira como foi 
  * feito no app.js para referência.
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

app.get('/api/beyblade/remover', (req, res) => {
  const { id } = req.params;

  db.all(
    `REMOVE FROM beyblades WHERE id = ?`,
    [ id ]
  )
}) 

app.listen(porta, () => {
  console.log("App rodando na porta ", porta)
})

module.exports = app