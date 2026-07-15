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
const express = require('express');
const app = express();
const path = require('path');
const sql = require('sqlite3').verbose();
app.use(express.json());

const port = 3000;


const  beybladedb = new sql.Database (
  './beyblade.db',
  (erro) => { // Função que executa que o banco é criado
    if (erro) {
      console.error('Erro ao abrir o banco de dados "beyblade.db":', 
        erro.message);
    } else {
      console.log('Conectado ao banco de dados SQLite3 "beyblade.db"');
    }
  }
)
beybladedb.run (
  `CREATE TABLE IF NOT EXISTS beyblades (
 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  lamina TEXT,
  catraca TEXT,
  ponta TEXT,
  participante TEXT NOT NULL UNIQUE
 ) `,

  (erro) => {
    if (erro) {
      console.error('Erro ao criar  tabela "beyblades"', erro.message);
    } else {
      console.log('Tabela "beyblades" pronta!');
    }
  }
)


app.use(express.static(path.join(__dirname, 'src')));
app.get ( '/', (req, res) => {
  res.sendFile(path.join(__dirname, 'indexAtv.html'))
} );


app.listen(3000, () => {
    console.log('Servidor rodando! Acesse http://localhost:3000/');
});


module.exports = app
