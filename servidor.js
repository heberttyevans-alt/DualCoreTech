// import do Express
const express = require('express');
//criando aplicação do express
const app = express();
// Definição da porta do servidor
const PORT = process.env.PORT || 3000;
//Middleware para formulários
app.use(express.urlencoded({ extended: true }));
// Middleware para Json
app.use(express.json());
// Middleware para arquivos estáticos
app.use(express.static('public'));
//Definido rotas
app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor da DualCoreTech!');
});
app.get('/home', (req, res) => {
    res.send('<h1>Bem-vindo à DualCoreTech!</h1>'
        + '<p>Seu computador ou videogame te deixaram na mão?.</p>' 
        + '<p>Não se preocupe, nós temo a solução ideal para você!.</p>'
    );
});
app.get('/inicio', (req, res) => {
    res.redirect('/home');
});
app.get('/sobre', (req, res) => {
    res.send('<h1>Quem somos nós?</h1><p>Somos uma empresa focada em montagem e manutenção de computadores, além de oferecer e prestar serviços de consultoria em tecnologia da informação. Nossa missão é fornecer soluções tecnológicas de alta qualidade para nossos clientes, garantindo a satisfação e o sucesso de seus projetos. Além de prestarmos serviços de manutenção, tanto perventiva quanto corretiva, em consoles de videogames em geral.</p>');
});
app.get('/contato', (req, res) => {
    res.send('<h1>Entre em contato conosco!</h1><p>Telefone: (XX) XXXX-XXXX</p><p>Email: contato@dualcoretech.com</p>');
});
//Middleware para lidar com rotas não encontradas
app.use((req, res) => {
    res.status(404).send(
        '<h1>404 - Página Não Encontrada</h1><p>A página que você está procurando não existe.</p>'
    )
});
// Iniciando o servidor
app.listen(PORT, () => {
    console.log( `Servidor rodando em http://localhost:${PORT}` );
});