const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Usa uma variável de ambiente para o caminho do DB, com um fallback para o local.
// Isso é crucial para o deploy em plataformas como o Railway.
const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[DB] Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('[DB] Conectado ao banco de dados SQLite em:', dbPath);
  }
});

// Função para garantir que o admin exista e tenha os privilégios corretos
const setupAdmin = () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminNome = process.env.ADMIN_NOME || 'Administrador';
  const adminSenha = process.env.ADMIN_SENHA;

  if (!adminEmail || !adminSenha) {
    console.warn('[DB] Variáveis de ambiente ADMIN_EMAIL e ADMIN_SENHA não definidas. Nenhum usuário admin será configurado automaticamente.');
    return;
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [adminEmail], (err, user) => {
    if (err) return console.error(`[DB] Erro ao verificar usuário admin:`, err.message);

    if (user) {
      if (!user.isAdmin) {
        db.run('UPDATE usuarios SET isAdmin = 1 WHERE email = ?', [adminEmail], (updateErr) => {
          if (updateErr) return console.error(`[DB] Erro ao atualizar privilégios de admin para '${adminEmail}':`, updateErr.message);
          console.log(`[DB] Privilégios de administrador concedidos para '${adminEmail}'.`);
        });
      }
    } else {
      bcrypt.hash(adminSenha, 10, (hashErr, hash) => {
        if (hashErr) return console.error(`[DB] Erro ao gerar hash para senha do admin:`, hashErr.message);
        db.run('INSERT INTO usuarios (nome, email, senha, isAdmin) VALUES (?, ?, ?, 1)', [adminNome, adminEmail, hash], (insertErr) => {
          if (insertErr) return console.error(`[DB] Erro ao criar usuário admin '${adminEmail}':`, insertErr.message);
          console.log(`[DB] Usuário administrador '${adminEmail}' criado com sucesso.`);
        });
      });
    }
  });
};

db.serialize(() => {
  // Tabela de usuários
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    senha TEXT,
    google_id TEXT,
    isAdmin INTEGER DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de pedidos (solicitações de serviço)
  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    servico TEXT,
    descricao TEXT,
    status TEXT DEFAULT 'Pendente',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    visivel_usuario INTEGER DEFAULT 1,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);

  // Tabela de contatos (mensagens gerais)
  db.run(`CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    nome TEXT,
    email TEXT,
    telefone TEXT,
    mensagem TEXT,
    status TEXT DEFAULT 'Pendente',
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);

  // --- SCRIPT PARA GARANTIR USUÁRIO ADMIN ---
  // Este script verifica e cria/atualiza um usuário administrador
  // com base nas variáveis de ambiente (ADMIN_EMAIL, ADMIN_SENHA, ADMIN_NOME).
  // É seguro para ser executado em toda inicialização.
  setupAdmin();

});

module.exports = db;