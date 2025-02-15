FROM node:16.3.0-alpine3.13
WORKDIR /serverTest
COPY package*.json ./
RUN npm install
COPY . .
COPY ssl/db-key.pem /ssl/db-key.pem
COPY ssl/db-cert.pem /ssl/db-cert.pem
EXPOSE 8000

ENV SSL_KEY=/ssl/db-key.pem
ENV SSL_CERT=/ssl/db-cert.pem

CMD [ "node", "index.js" ]