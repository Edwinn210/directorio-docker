FROM node:24.7.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "start"]
