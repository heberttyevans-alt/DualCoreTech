FROM node:20-alpine

WORKDIR /app

# Instalar dependências de build necessárias para sqlite3
RUN apk add --no-cache python3 make g++ 

COPY package*.json ./

# Instalar dependências com rebuild dos módulos nativos
RUN npm ci --prefer-offline --no-audit && npm rebuild

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
