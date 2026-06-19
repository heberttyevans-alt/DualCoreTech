const express = require('express');
const router = express.Router();

router.get('/contato', (req, res) => {
  res.render('contato', { titulo: 'Contato' });
});

router.get('/contatos', (req, res) => {
  res.render('contato', { titulo: 'Contato' });
});

router.post('/contatos', (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).send('Preencha todos os campos.');
  }

  res.send(`Mensagem recebida de ${nome}!`);
});

module.exports = router;
