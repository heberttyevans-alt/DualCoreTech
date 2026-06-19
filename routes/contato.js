const express = require('express');
const router = express.Router();

router.get('/contato', (req, res) => {
  res.render('contato', {
    titulo: 'Contato',
    erro: null,
    dados: {}
  });
});

router.get('/contatos', (req, res) => {
  res.render('contato', {
    titulo: 'Contato',
    erro: null,
    dados: {}
  });
});

router.post('/contatos', (req, res) => {
  const { nome, email, mensagem } = req.body;
  const nomeLimpo = nome?.trim();
  const emailLimpo = email?.trim();
  const mensagemLimpa = mensagem?.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nomeLimpo || !emailLimpo || !mensagemLimpa) {
    return res.status(400).render('contato', {
      titulo: 'Contato',
      erro: 'Preencha todos os campos.',
      dados: req.body
    });
  }

  if (!emailValido.test(emailLimpo)) {
    return res.status(400).render('contato', {
      titulo: 'Contato',
      erro: 'Email inválido. Informe um endereço válido.',
      dados: req.body
    });
  }

  res.send(`Mensagem recebida de ${nomeLimpo}!`);
});

module.exports = router;
