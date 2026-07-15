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

const express = require('express');
const app = express();
const path = require('path');
const sql = require('sqlite3').verbose()
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

app.get ('/api/beyblade/cadastrar', (req, res) => {
  const {nome, lamina, catraca, ponta, participante} = req.query

  beybladedb.run(
  ` INSERT INTO beyblades 
  (nome, lamina, catraca, ponta, participante) VALUES (?, ?, ?, ?, ?)`,
    [ nome, lamina, catraca, ponta, participante],

    (erro, itens) => {
    
      (erro) => {
          if (erro) {
            console.error('Erro ao inserir dados na tabela "beyblades"', erro.message);
          } else {
            console.log('Dados inseridos na tabela "beyblades');
          }
        }
      
}
  
  )
}
)


app.listen(3000, () => {
    console.log('Servidor rodando! Acesse http://localhost:3000/');
});


module.exports = app
