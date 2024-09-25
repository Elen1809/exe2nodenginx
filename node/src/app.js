const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

function connectWithRetry() {
  const pool = mysql.createPool({
    host: 'db', 
    user: 'root',
    password: 'elen',
    database: 'nodedb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  return pool;
}

const pool = connectWithRetry();

const insertPerson = (name) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO people(name) VALUES(?)`;
    pool.query(sql, [name], (err, result) => {
      if (err) {
        console.error(`Erro ao inserir o registro ${name}:`, err);
        return reject(err);
      }
      console.log(`Registro ${name} inserido com sucesso.`);
      resolve(result);
    });
  });
};

const getPeople = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT name FROM people', (err, results) => {
      if (err) {
        console.error('Erro ao consultar registros:', err);
        return reject(err);
      }
      console.log('Consulta aos registros feita com sucesso.');
      resolve(results);
    });
  });
};

app.get('/insert', async (req, res) => {
  try {
    console.log('Iniciando inserções no banco de dados.');

    await Promise.all([
      insertPerson('Elen'),
      insertPerson('Maria'),
      insertPerson('João')
    ]);

    console.log('Registros inseridos com sucesso.');

    // Consultando os registros depois de inserir
    const people = await getPeople();

    // Montando a resposta HTML com os nomes
    let response = '<h1>Full Cycle Rocks!!</h1><ul>';
    people.forEach((row) => {
      response += `<li>${row.name}</li>`;
    });
    response += '</ul>';

    console.log('Enviando resposta ao cliente.');
    res.send(response);
  } catch (err) {
    console.error('Erro ao inserir registros e consultar:', err);
    res.status(500).send('Erro ao inserir registros e consultar.');
  }
});

app.get('/', async (req, res) => {
  try {
    console.log('Consultando registros.');

    const people = await getPeople();

    let response = '<h1>Full Cycle Rocks!!</h1><ul>';
    people.forEach((row) => {
      response += `<li>${row.name}</li>`;
    });
    response += '</ul>';

    console.log('Enviando resposta ao cliente.');
    res.send(response);
  } catch (err) {
    console.error('Erro ao consultar registros:', err);
    res.status(500).send('Erro ao consultar registros.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
