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


const express = require('express')
const path = require('path')
const cors = require('cors');
// Importando a ferramenta pra utilizar bancos de dados
const sql = require('sqlite3').verbose()

// Definindo a porta usada para abrir o servidor (no final deste código)
const porta = 3000

const app = express()
// Necessário para leitura do corpo de uma requisição
app.use(express.urlencoded({ extended: true }))
// Necessário para interpretação do formato JSON
app.use(express.json())
// Para evitar erros de CORS
app.use(cors());
// Para configurar o servidor para olhar dentro da pasta src por padrão
app.use(express.static(path.join(__dirname, 'src')));


// Criação do banco de dados
const db = new sql.Database(
  './beyblade.db', // Nome do arquivo do banco de dados
  (erro) => { // Função que executa que o banco é criado
    if (erro) {
      console.error('Erro ao abrir o banco de dados "beyblade.db":', erro.message);
    } else {
      console.log('Conectado ao banco de dados SQLite3 "beyblade.db"');
    }
  }
)

// A função "run" executa código SQL, e recebe 2 argumentos
db.run(
  // 1º argumento = comando SQL
  `CREATE TABLE IF NOT EXISTS beyblades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    lamina TEXT,
    catraca TEXT,
    ponta TEXT,
    participante TEXT NOT NULL UNIQUE

  )`,
  // 2º argumento = função executada após termos o resultado do comando SQL
  (erro) => {
    if (erro) {
      console.error('Erro ao criar a tabela "beyblades"', erro.message);
    } else {
      console.log('Tabela "beyblades" pronta!');
    }
  }
)

// Rota da página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'indexAtv.html'))
})

app.get('/api/beyblade', (req, res) => {
  // "all" envia todas as informações que combinarem com os parâmetros
  db.all(
    // 1º argumento: comando SQL
    `SELECT * FROM beyblades`, 
    // 3º argumento: Função executada após termos o resultado do comando SQL
    (erro, resultados) => {
    // Se não tiver resultado, enviamos outro tipo de erro
  if (erro) {
    res.status(500).json({ error: erro.message })
    return
}
      // Se der bom, enviamos o resultado
      res.json(resultados)
    }
  )
})

app.get('/api/beyblade/cadastrar', (req, res) => {

   // Extraímos os dados argumentos pelo formulário
  const {
    nome, lamina, catraca, ponta, participante
  } = req.query


    db.run(
        `INSERT INTO beyblades 
        (nome, lamina, catraca, ponta, participante)
        VALUES (?, ?, ?, ?, ?)`,
        [nome, lamina, catraca, ponta, participante],
        (erro) => {
            if (erro) {
                res.status(500).json({ error: erro.message })
                return
            }

            res.json({
                message: 'Beyblade cadastrado com sucesso!'
            })
        }
    )
})


app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`)
})

module.exports = app

