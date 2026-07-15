/*
  * [ATIVIDADE 4 - Eliminar Item]
  *
  * Copie o servidor feito na atividade 03, e acrescente uma
  * rota "DLETE" para o endereço "/api/beyblade/remover" após a rota
  * "/api/beyblade/cadastrar" criada no exercício anterior.
  *
  * Esta rota é executada quando, na tabela de beyblades cadastradas,
  * o botão "Remaover" é clicado. Esta rota deve armazenar as o id
  * da beyblade a ser removida (desta vez, por não ser uma rota do
  * tipo GET, essa informação não existe dentro de req.query, mas sim
  * dentro de req.params), e repassar esse id para o comando
  * SQL que realiza a remoção de itens da tabela. Confira como foi 
  * feito no app.js para referência.
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
  (erro) => {
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

  beybladedb.all(
  ` INSERT INTO beyblades 
  (nome, lamina, catraca, ponta, participante) VALUES (?, ?, ?, ?, ?)`,
    [ nome, lamina, catraca, ponta, participante],

    (erro, itens) => {
    

          if (erro) {
            console.error('Erro ao inserir dados na tabela "beyblades"', erro.message);
          } else {
            console.log('Dados inseridos na tabela "beyblades');
          }
        
})})


app.delete('/api/beyblade/remover/:id', (req, res) => {
  if (!req.params) {
    res.status(400).json({ error: erro.message });
    return
  }

  const { id } = req.params

  beybladedb.all(
    `DELETE FROM beyblades WHERE id = ?`,
    [ id ],

    function (erro, itens) {
      if (erro) {
        res.status(400).json({ error: erro.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'beyblade não encontrada' });
        return;
      }
      res.json({
        message: `beyblade removida.`,
        id:id,
        total: itens,
      });
    }
  )
})



app.listen(3000, () => {
    console.log('Servidor rodando! Acesse http://localhost:3000/');
});


module.exports = app