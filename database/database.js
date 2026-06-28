const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

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

  // --- SCRIPT PARA DEFINIR USUÁRIO COMO ADMIN (USAR UMA VEZ) ---
  // Este script define o usuário com o email 'fcarrom89@gmail.com' como administrador.
  // Ele será executado na próxima vez que o servidor iniciar.
  // Após a execução, é recomendado remover ou comentar este bloco.
  const adminEmailToSet = 'fcarrom89@gmail.com';
  db.run(`UPDATE usuarios SET isAdmin = 1 WHERE email = ?`, [adminEmailToSet], function(err) {
    if (err) {
      return console.error(`Erro ao tentar definir '${adminEmailToSet}' como admin:`, err.message);
    }
    if (this.changes > 0) {
      console.log(`[DB] O usuário '${adminEmailToSet}' foi definido como administrador.`);
    }
  });

});

module.exports = db;