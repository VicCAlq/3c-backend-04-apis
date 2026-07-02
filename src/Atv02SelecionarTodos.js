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
    }
  }
)

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
    }
  )

})

app.listen(3000, () => {
})

module.exports = app