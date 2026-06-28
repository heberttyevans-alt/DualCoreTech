require('dotenv').config();
const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database/database');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET || 'sua_chave_secreta',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, user) => {
    done(err, user);
  });
});

const googleAuthEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

if (googleAuthEnabled) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    const nome = profile.displayName || profile.name?.givenName || 'Usuário Google';
    const googleId = profile.id;

    if (!email) {
      return done(new Error('Google login não retornou email.'));
    }

    db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, user) => {
      if (err) return done(err);

      if (user) {
        if (!user.google_id) {
          db.run('UPDATE usuarios SET google_id = ? WHERE id = ?', [googleId, user.id], (updateErr) => {
            if (updateErr) return done(updateErr);
            user.google_id = googleId;
            done(null, user);
          });
        } else {
          done(null, user);
        }
      } else {
        db.run('INSERT INTO usuarios (nome, email, google_id) VALUES (?, ?, ?)', [nome, email, googleId], function (insertErr) {
          if (insertErr) return done(insertErr);
          db.get('SELECT * FROM usuarios WHERE id = ?', [this.lastID], (err2, newUser) => {
            done(err2, newUser);
          });
        });
      }
    });
  }));
} else {
  console.warn('Google OAuth não está configurado. Defina GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.');
}

app.use((req, res, next) => {
  res.locals.anoAtual = new Date().getFullYear();
  res.locals.paginaAtual = req.path;
  res.locals.usuario = req.session.usuario || req.user || null;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const servicosRouter = require('./routes/servicos');
const sobreRouter = require('./routes/sobre');
const contatoRouter = require('./routes/contato');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');

// As rotas são montadas com seus prefixos para melhor organização.
app.use('/servicos', servicosRouter);
app.use('/sobre', sobreRouter);
app.use('/contato', contatoRouter);
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', dashboardRouter);

app.use((req, res) => {
  res.status(404).render('404', { titulo: 'Página Não Encontrada' });
});

// Middleware de tratamento de erro (deve ser o último)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { titulo: 'Erro no Servidor' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});