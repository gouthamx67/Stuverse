FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# The --host flag is required in Docker to expose Vite to localhost on the host machine
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
