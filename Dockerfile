FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY frontend/package*.json frontend/
RUN npm install --omit=dev --prefix frontend

COPY backend/package*.json backend/
RUN npm install --omit=dev --prefix backend

COPY frontend/ frontend/
RUN npm run build --prefix frontend

COPY backend/ backend/
RUN npm run build --prefix backend

USER node

CMD [ "npm", "start", "--prefix", "backend" ]

EXPOSE 8000