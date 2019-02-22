FROM node:alpine as builder

WORKDIR /tmp

COPY tsconfig.json ./
COPY tsconfig.prod.json ./
COPY package*.json ./
COPY src src

RUN npm install typescript -g && npm install
RUN tsc -p tsconfig.prod.json

FROM node:alpine as server

WORKDIR /app
COPY package*.json ./
COPY --from=builder /tmp/build/ ./
RUN npm install --only=production

EXPOSE 8080
CMD [ "node", "index.js" ]
