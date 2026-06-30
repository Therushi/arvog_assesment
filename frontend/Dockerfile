FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

# --host 0.0.0.0 so it is reachable from outside the container
# --poll helps file-watching across the Docker bind mount
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "500"]