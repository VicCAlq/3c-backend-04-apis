// Importando funcionalidades e bibliotecas necessárias
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
  './figurinhas.db', // Nome do arquivo do banco de dados
  (erro) => { // Função que executa que o banco é criado
    if (erro) {
      console.error('Erro ao abrir o banco de dados "figurinhas.db":', erro.message);
    } else {
      console.log('Conectado ao banco de dados SQLite3 "figurinhas.db"');
    }
  }
)

// A função "run" executa código SQL, e recebe 2 argumentos
db.run(
  // 1º argumento = comando SQL
  `CREATE TABLE IF NOT EXISTS selecao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    posicao TEXT CHECK(posicao in ('atacante', 'meio-campo', 'zagueiro', 'goleiro')),
    camisa INTEGER
  )`,
  // 2º argumento = função executada após termos o resultado do comando SQL
  (erro) => {
    if (erro) {
      console.error('Erro ao criar a tabela "selecao"', erro.message);
    } else {
      console.log('Tabela "selecao" pronta!');

      db.run(
        `INSERT INTO selecao (nome, posicao, camisa) VALUES
          ('Alisson', 'goleiro', 1),
          ('Alex Sandro', 'zagueiro', 2),
          ('Alex', 'zagueiro', 3),
          ('Marquinhos', 'zagueiro', 4),
          ('Vanderson', 'zagueiro', 5),
          ('Guimarães', 'meio-campo', 6),
          ('Casemiro', 'meio-campo', 7),
          ('Gerson', 'meio-campo', 8),
          ('Vinícius Jr.', 'atacante', 9),
          ('Cunha', 'atacante', 10),
          ('Raphinha', 'atacante', 11)
        `,
        (erro) => {
          if (erro) {
            console.error('Erro ao criar inserir jogadores na tabela "selecao"', erro.message);
          } else {
            console.log('Jogadores inseridos na tabela "selecao');
          }
        }
      )
    }
  }
)

// Rota da página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Nossa primeira rota de API vai enviar todas as informações do banco de dados
app.get('/api/figurinhas', (req, res) => {

  // "all" envia todas as informações que combinarem com os parâmetros
  db.all(
    // 1º argumento: comando SQL
    `SELECT * FROM selecao`, 
    // 2º argumento: parâmetros (exemplo: posição = "zagueiro")
    [],
    // 3º argumento: Função executada após termos o resultado do comando SQL
    (erro, itensDaTabela) => {
      // Se der ruim, enviamos a mensagem  de erro
      if (erro) {
        res.status(400).json({ error: erro.message })
        return
      }

      // Se der bom, enviamos o resultado
      res.status(200).json({
        message: "Requisição feita com sucesso",
        data: itensDaTabela
      })
    }
  )
})

// Aqui temos uma rota de APi para encontrar jogadores de uma determinada posição
app.get('/api/figurinhas/posicao/:posicao', (req, res) => {
  // Extraímos o argumento que queremos usar da requição
  const posicao = req.params.posicao

  // "all" envia todas as informações que combinarem com os parâmetros
  db.all(
    // 1º argumento: comando SQL
    `SELECT * FROM selecao WHERE posicao = ?`, 
    // 2º argumento: parâmetros (exemplo: posição = "zagueiro")
    [ posicao ],
    // 3º argumento: Função executada após termos o resultado do comando SQL
    (erro, itensDaTabela) => {
      // Se der ruim, enviamos a mensagem  de erro
      if (erro) {
        res.status(400).json({ error: erro.message })
        return
      }
      // Se não tiver resultado, enviamos outro tipo de erro
      if (erro) {
        res.status(404).json({ error: "Nenhum jogador encontrado nesta posição" })
        return
      }
      // Se der bom, enviamos o resultado
      res.status(200).json({
        message: "Requisição feita com sucesso",
        data: itensDaTabela
      })
    }
  )
})

// Aqui temos uma rota de APi para encontrar um jogaddor a partir de seu nome
app.get('/api/figurinhas/nome/:nome', (req, res) => {
  // Extraímos o argumento que queremos usar da requição
  const nome = req.params.nome

  // "all" envia todas as informações que combinarem com os parâmetros
  db.all(
    // 1º argumento: comando SQL
    `SELECT * FROM selecao WHERE nome = ? COLLATE NOCASE`, 
    // O "COLLATE NOCASE" acima é pra ignorar se a letra é maiúscula ou minúscula
    // 2º argumento: parâmetros (exemplo: posição = "zagueiro")
    [ nome ],
    // 3º argumento: Função executada após termos o resultado do comando SQL
    (erro, itensDaTabela) => {
      // Se der ruim, enviamos a mensagem  de erro
      if (erro) {
        res.status(400).json({ error: erro.message })
        return
      }
      // Se não tiver resultado, enviamos outro tipo de erro
      if (erro) {
        res.status(404).json({ error: "Nenhum jogador com este nome foi encontrado" })
        return
      }
      // Se der bom, enviamos o resultado
      res.status(200).json({
        message: "Requisição feita com sucesso",
        data: itensDaTabela
      })
    }
  )
})

// Esta rota permite cadastrar um novo jogador no time
app.get('/api/figurinhas/convocar', (req, res) => {
  // Se não houver requisição, enviamos um erro
  if (!req.query) {
    res.status(400).json({ error: erro.message });
    return
  }

  // Extraímos os argumentos enviados pela requisição
  const {
    nome, posicao, camisa
  } = req.query

  db.all(
    // Comando INSERT no SQL, onde as interrogações vão ser substituídas pelos valores
    `INSERT INTO selecao (nome, posicao, camisa) VALUES (?, ?, ?)`,
    [ nome, posicao, camisa],
    // Tratamento básico de erros como nos casos acima
    (erro, itensDaTabela) => {
      if (erro) {
        res.status(400).json({ error: erro.message });
        return;
      }
      res.json({
        message: `Jogador ${nome} convocado com sucesso para a posição de ${posicao} com a camisa ${camisa}`,
        data: { id: this.lastID },
        id: this.lastID,
        total: itensDaTabela,
      });
    }
  )
})

// A rota abaixo permite remover um jogador a partir de seu nome
app.delete('/api/figurinhas/eliminar/:id', (req, res) => {
  if (!req.params) {
    res.status(400).json({ error: erro.message });
    return
  }

  const { id } = req.params

  db.all(
    `DELETE FROM selecao WHERE id = ?`,
    [ id ],
    (erro, itensDaTabela) => {
      if (erro) {
        res.status(400).json({ error: erro.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Personagem não encontrado' });
        return;
      }
      res.json({
        message: `Jogador removido da escalação.`,
        data: { id: this.lastID },
        id: this.lastID,
        total: itensDaTabela,
      });
    }
  )
})

// Inicializando o servidor na porta definida anteriormente
app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`)
})
