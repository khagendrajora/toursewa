FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

ENV JWTSECRET=hello
ENV FRONTEND_URL="http://localhost:5173"
ENV Backend_URL='http://localhost:5000/api'

CMD ["node", "dist/index.js"]