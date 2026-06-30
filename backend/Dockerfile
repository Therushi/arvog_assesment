FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# nodemon for hot-reload across the Docker bind mount
CMD ["npm", "run", "dev"]
