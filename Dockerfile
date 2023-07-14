FROM node:18.12.1

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

RUN npm run build

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
