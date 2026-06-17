const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Certifique-se que este middleware está no servidor.js
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.anoAtual = new Date().getFullYear();
  res.locals.paginaAtual = req.path; // URL atual
  next();
});
// Atualizar
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Home' });
});

app.get('/home', (req, res) => {
  res.render('index', { titulo: 'Home' });
});

// Sobre
app.get('/sobre', (req, res) => {
  res.render('sobre', { titulo: 'Sobre' });
});

app.get('/contato', (req, res) => {
  res.render('contato', { titulo: 'Contato' });
});

app.get('/contatos', (req, res) => {
  res.render('contato', { titulo: 'Contato' });
});

app.post('/contatos', (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).send('Preencha todos os campos.');
  }

  res.send(`Mensagem recebida de ${nome}!`);
});

app.use((req, res) => {
    res.status(404).render('404', { titulo: 'Página Não Encontrada' });
});
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });