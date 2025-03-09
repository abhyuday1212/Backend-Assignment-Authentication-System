FROM node:21.1.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000:8000

CMD ["npm", "run", "dev"]