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

const express = require('express')
const path = require('path')
const cors = require('cors');
const sql = require('sqlite3').verbose()
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));

const db = new sql.Database(
  "./beyblade.db",
  (erro) => { 
    if (erro) {
      console.error('Erro ao abrir o banco de dados "beyblade.db":', erro.message);
    } else {
      console.log('Conectado ao banco de dados SQLite3 "beyblade.db"');
    }})

db.run(`CREATE TABLE IF NOT EXISTS beyblades
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    lamina TEXT,
    catraca TEXT,
    ponta TEXT,
    participante TEXT NOT NULL UNIQUE
  )
  `,
  (erro) => {
    if (erro) {
      console.error('Erro ao criar a tabela "selecao"', erro.message);
    } else {
      console.log('Tabela "selecao" pronta!');
    }}
)

app.get('/', (req,res) =>{
  res.sendFile(path.join(__dirname, 'indexAtv.html'))
})

app.get('/api/beyblade', (req,res) =>{
  db.all(
    `SELECT * FROM beyblades`,
    [],
    (erro, itensBeyblade) => {
       if (erro) {
        res.status(400).json({ error: erro.message })
        return
      }

      res.status(200).json({message: "Requisição feita com sucesso",
        data: itensBeyblade})
    })})

app.get('/api/beyblade/cadastrar', (req,res) =>{
  const{ nome, lamina, catraca, ponta, participante } = req.query
db.all(`INSERT INTO beyblades (nome, lamina, catraca, ponta, participante VALUES(?,?,?,?,?)`,
  [nome, lamina, catraca, ponta, participante],
  
  (erro, itensBeyblade) => {

    if (erro) {
      res.status(400).json({ error: erro.message });
      return;
    }
    res.json({
      message: `A beyblade ${nome}, com lamina ${lamina}, catraca ${catraca} e ponta ${ponta} do participante ${participante}
       foi cadastrada com sucesso`,
      data: { id: this.lastID },
      id: this.lastID,
      total: itensBeyblade,
    });
  }
)
  
})

app.delete('/api/beyblade/remover/:id', (req, res) => {
  const { id } = req.params;

db.all(`DELETE FROM beyblades WHERE id = ?`,
  [id],
  (erro, itensBeyblade) => {
    if(erro)
    {
      res.status(400).json({ error: erro.message });
      return;

    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Cadastro não encontrado' });
      return;
    }

    res.json({
      message: `Cadastro removido com sucesso.`,
      data: { id: this.lastID },
      id: this.lastID,
      total: itensDaTabela,
    });
  }
)
  
})



app.listen(3000, () => {
})

module.exports = app