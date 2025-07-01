FROM node:18-alpine

WORKDIR /app

RUN apk update && apk add --no-cache python3 g++ 

COPY . .

COPY package*.json ./
RUN npm install 

EXPOSE 5000

CMD ["node","index.js"]


