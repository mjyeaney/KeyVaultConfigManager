FROM node:latest

WORKDIR /app/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8009
CMD node server.js 