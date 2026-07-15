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

app.get ('/api/beyblade', (req, res) => {
  beybladedb.all (
    `SELECT * FROM beyblades`,
   
    [],


    (erro, itens) => {
      if(erro) {
        return res.status(400)
        .json({ error: erro.message });
      }


      res.status(200).json({
        message: 'Requisição feita com sucesso',
        data: itens
      })
      }
  );
      })



app.listen(3000, () => {
    console.log('Servidor rodando! Acesse http://localhost:3000/');
});


module.exports = app