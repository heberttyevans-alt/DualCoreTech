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
    const { status, busca } = req.query;

    let query;
    const params = [];
    const whereClauses = [];

    if (user.isAdmin) {
        query = `
            SELECT * FROM (
                SELECT
                    p.id, p.usuario_id, p.servico, p.status, p.data_criacao, u.nome, u.email,
                    NULL AS telefone, p.descricao AS mensagem, 'pedido' AS tipo
                FROM pedidos p
                LEFT JOIN usuarios u ON p.usuario_id = u.id
                
                UNION ALL
                
                SELECT
                    c.id, c.usuario_id, 'Contato' AS servico, c.status, c.data_criacao, c.nome, c.email,
                    c.telefone, c.mensagem, 'contato' AS tipo
                FROM contatos c
            )
        `;

        if (busca) {
            whereClauses.push(`(nome LIKE ? OR email LIKE ? OR servico LIKE ? OR mensagem LIKE ?)`);
            const searchTerm = `%${busca}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
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
        `;
        params.push(user.id, user.id);

        if (busca) {
            whereClauses.push(`(servico LIKE ? OR mensagem LIKE ?)`);
            const searchTerm = `%${busca}%`;
            params.push(searchTerm, searchTerm);
        }
    }

    if (status) {
        whereClauses.push(`status = ?`);
        params.push(status);
    }

    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY data_criacao DESC`;

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
            filtroStatus: status || '',
            filtroBusca: busca || ''
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

// Rota para admin excluir solicitação
router.post('/admin/excluir-solicitacao', (req, res) => {
    if (!req.session.usuario || !req.session.usuario.isAdmin) return res.status(403).send("Acesso negado");

    const { id, tipo } = req.body;

    if (!id || !tipo) {
        return res.status(400).send("ID ou Tipo da solicitação não fornecido.");
    }

    const table = tipo === 'contato' ? 'contatos' : 'pedidos';

    db.run(`DELETE FROM ${table} WHERE id = ?`, [id], (err) => {
        if (err) console.error("Erro ao excluir solicitação:", err.message);
        res.redirect('/dashboard');
    });
});

// Rota para usuário excluir sua própria solicitação
router.post('/dashboard/excluir-solicitacao', (req, res) => {
    if (!req.session.usuario) {
        return res.status(403).send("Acesso negado. Você precisa estar logado.");
    }

    const { id, tipo } = req.body;
    const usuarioId = req.session.usuario.id;

    if (!id || !tipo) {
        return res.status(400).send("ID ou Tipo da solicitação não fornecido.");
    }

    const table = tipo === 'contato' ? 'contatos' : 'pedidos';

    // A consulta garante que o usuário só pode deletar suas próprias solicitações e apenas se estiverem pendentes.
    const query = `DELETE FROM ${table} WHERE id = ? AND usuario_id = ? AND status = 'Pendente'`;

    db.run(query, [id, usuarioId], function(err) {
        if (err) {
            console.error("Erro ao excluir solicitação do usuário:", err.message);
        }
        res.redirect('/dashboard');
    });
});

module.exports = router;