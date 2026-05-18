# DualCoreTech

Um projeto web desenvolvido com Node.js, Express e EJS.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **EJS** - Template engine
- **Nodemon** - Ferramenta de desenvolvimento

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm (gerenciador de pacotes)

## 💻 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd DualCoreTech
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Executar

### Modo Desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Modo Produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000` (ou a porta configurada)

## 📁 Estrutura do Projeto

```
DualCoreTech/
├── public/           # Arquivos estáticos (CSS, imagens, JS)
│   ├── css/
│   ├── images/
│   └── js/
├── routes/           # Rotas da aplicação
│   ├── index.js
│   ├── usuarios.js
│   └── contato.js
├── views/            # Templates EJS
│   ├── index.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
├── servidor.js       # Arquivo principal do servidor
└── package.json      # Configurações do projeto
```

## 🔧 Configuração

Edite o arquivo `servidor.js` para configurar:
- Porta do servidor
- Middlewares
- Rotas

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento com nodemon

## 👤 Autor

Hebertty Luiz de Adrade

## 📄 Licença

ISC

---

**Desenvolvido como projeto escolar** - Técnico de Informática para Internet, e futuramente utilizado em um epreendimento próprio
