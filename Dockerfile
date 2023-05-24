FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm install sqlite3

RUN npx tsc

CMD ["node", "./bin/www"]