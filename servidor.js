require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.anoAtual = new Date().getFullYear();
  res.locals.paginaAtual = req.path; 
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const servicosRouter = require('./routes/servicos');
const sobreRouter = require('./routes/sobre');
const contatoRouter = require('./routes/contato');

app.use('/', indexRouter);
app.use('/servicos', servicosRouter);
app.use('/', sobreRouter);
app.use('/', contatoRouter);

app.use((req, res) => {
  res.status(404).render('404', { titulo: 'Página Não Encontrada' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});