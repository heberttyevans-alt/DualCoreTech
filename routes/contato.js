const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.get('/', (req, res) => {
  res.render('contato', {
    titulo: 'Contato',
    erro: null,
    sucesso: null,
    dados: {}
  });
});

router.post('/', (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;
    const mensagemLimpa = mensagem?.trim();

    if (!nome?.trim() || !email?.trim() || !mensagemLimpa) {
        return res.status(400).render('contato', {
            titulo: 'Contato',
            erro: 'Preencha os campos obrigatórios: Nome, Email e Mensagem.',
            sucesso: null,
            dados: req.body
        });
    }

    const usuarioId = req.session.usuario ? req.session.usuario.id : null;
    // Usa os dados do formulário, pois o usuário pode estar enviando em nome de outra pessoa.
    // O ID do usuário logado é salvo para referência.
    db.run(
        `INSERT INTO contatos (usuario_id, nome, email, telefone, mensagem) VALUES (?, ?, ?, ?, ?)`,
        [usuarioId, nome, email, telefone, mensagemLimpa],
        (err) => {
            if (err) {
                console.error('Erro ao inserir contato:', err.message);
                return res.status(500).render('contato', {
                    titulo: 'Contato', erro: 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.', sucesso: null, dados: req.body
                });
            }

            // Se o usuário estiver logado, ele é redirecionado para o painel para ver o contato enviado.
            if (req.session.usuario) {
                res.redirect('/dashboard');
            } else {
                // Se não, mostra uma mensagem de sucesso na própria página.
                res.render('contato', { titulo: 'Contato', erro: null, sucesso: 'Mensagem enviada com sucesso!', dados: {} });
            }
        }
    );
});

module.exports = router;
