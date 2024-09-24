const express = require('express');
const mysql = require('mysql2'); // Importando a biblioteca mysql
const app = express();
const port = 3000;

// Configurações de conexão com o banco de dados
const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'elen', // Certifique-se de usar a senha correta
  database: 'nodedb',
  waitForConnections: true,
  connectionLimit: 10,  // Limite de conexões simultâneas
  queueLimit: 0
});

// Rota principal
app.get('/', (req, res) => {
  // Consultando registros do banco de dados
  pool.query('SELECT name FROM people', (err, results) => {
    if (err) throw err;

    // Montando a resposta HTML com os nomes
    let response = '<h1>Full Cycle Rocks!!</h1><ul>';
    results.forEach((row) => {
      response += `<li>${row.name}</li>`;
    });
    response += '</ul>';

    res.send(response);
  });
});

// Inserindo um registro na tabela "people"
app.get('/insert', (req, res) => {
  const sql = `INSERT INTO people(name) VALUES('Elen')`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send('Registro inserido com sucesso!');
  });
});

// Fechando a conexão quando o servidor é encerrado
app.listen(port, () => {
  console.log('Servidor rodando na porta ' + port);
});
