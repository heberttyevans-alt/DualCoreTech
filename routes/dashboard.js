const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Redireciona /admin para /dashboard para administradores
router.get('/admin', (req, res) => {
    if (req.session.usuario && req.session.usuario.isAdmin) return res.redirect('/dashboard');
    return res.redirect('/login');
});

router.get('/dashboard', (req, res, next) => {
    if (!req.session.usuario) return res.redirect('/login');

    const user = req.session.usuario;

    let query;
    const params = [];

    if (user.isAdmin) {
        query = `
            SELECT * FROM (
                SELECT
                    p.id, p.usuario_id, p.servico, p.status, p.data_criacao,
                    u.nome, u.email, p.descricao AS mensagem, 'pedido' AS tipo
                FROM pedidos p
                LEFT JOIN usuarios u ON p.usuario_id = u.id
                
                UNION ALL
                
                SELECT
                    c.id, c.usuario_id, 'Contato' AS servico, c.status, c.data_criacao,
                    c.nome, c.email, c.mensagem, 'contato' AS tipo
                FROM contatos c
            )
            ORDER BY data_criacao DESC
        `;
    } else {
        query = `
            SELECT id, servico, mensagem, status, data_criacao, tipo FROM (
                SELECT id, servico, descricao AS mensagem, status, data_criacao, 'pedido' AS tipo
                FROM pedidos
                WHERE usuario_id = ? AND visivel_usuario = 1
                
                UNION ALL
                
                SELECT id, 'Contato' AS servico, mensagem, status, data_criacao, 'contato' AS tipo
                FROM contatos
                WHERE usuario_id = ?
            )
            ORDER BY data_criacao DESC
        `;
        params.push(user.id, user.id);
    }

    db.all(query, params, (err, pedidos) => {
        if (err) {
            console.error("ERRO NO DASHBOARD:", err.message);
            return next(err); // Passa o erro para o handler de erros global
        }
        const titulo = user.isAdmin ? 'Painel do Administrador' : 'Meu Painel';
        res.render('dashboard', {
            titulo: titulo,
            pedidos: pedidos || [],
            isAdmin: user.isAdmin,
        });
    });
});

// Rota para admin atualizar status
router.post('/admin/atualizar-status', (req, res) => {
    if (!req.session.usuario || !req.session.usuario.isAdmin) return res.status(403).send("Acesso negado");

    const { id, status, tipo } = req.body;

    if (!id || !tipo) {
        return res.status(400).send("ID ou Tipo da solicitação não fornecido.");
    }

    const validStatus = ['Pendente', 'Em Andamento', 'Concluído'];
    const nextStatus = validStatus.includes(status) ? status : 'Pendente';
    const table = tipo === 'contato' ? 'contatos' : 'pedidos';

    db.run(`UPDATE ${table} SET status = ? WHERE id = ?`, [nextStatus, id], (err) => {
        if (err) {
            console.error("Erro ao atualizar status:", err.message);
        }
        res.redirect('/dashboard');
    });
});

module.exports = router;