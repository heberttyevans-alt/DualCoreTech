const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/database');

// Rota para exibir a página de Login/Cadastro
router.get('/login', (req, res) => {
    res.render('login', { titulo: 'Login / Cadastro', erro: null, sucesso: null });
});

// Lógica de Cadastro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.render('login', { titulo: 'Login / Cadastro', erro: 'Preencha todos os campos obrigatórios.' });
  }

  const hash = await bcrypt.hash(senha, 10);

  db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, hash], (err) => {
    if (err) return res.render('login', { titulo: 'Login / Cadastro', erro: 'Erro ao cadastrar. E-mail já existe?', sucesso: null });
    res.render('login', { titulo: 'Login / Cadastro', erro: null, sucesso: 'Usuário criado com sucesso! Faça login.' });
  });
});

// Lógica de Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.render('login', { titulo: 'Login / Cadastro', erro: 'Preencha e-mail e senha.' });
  }

  db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], async (err, user) => {
    if (err || !user || !user.senha || !(await bcrypt.compare(senha, user.senha))) {
      return res.render('login', { titulo: 'Login / Cadastro', erro: 'Credenciais inválidas.', sucesso: null });
    }

    req.session.usuario = user;
    res.redirect('/dashboard');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  req.session.usuario = req.user;
  res.redirect('/dashboard');
});

module.exports = router;