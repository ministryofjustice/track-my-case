FROM node:22.10-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000
EXPOSE 9999

CMD [ "node", "server.js" ]