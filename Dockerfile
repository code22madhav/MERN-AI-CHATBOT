# ===============================
# 1️⃣ BUILD STAGE
# ===============================
FROM node:lts-alpine AS builder

WORKDIR /app

# ---- Install root deps (if any) ----
COPY package*.json ./

# ---- Frontend deps & build ----
COPY frontend/package*.json frontend/
RUN npm install --prefix frontend

COPY frontend frontend
RUN npm run build --prefix frontend

# ---- Backend deps & build ----
COPY backend/package*.json backend/
RUN npm install --prefix backend

COPY backend backend
RUN npm run build --prefix backend


# ===============================
# 2️⃣ PRODUCTION STAGE
# ===============================
FROM node:lts-alpine

WORKDIR /app

# ---- Backend production deps only ----
COPY backend/package*.json backend/
RUN npm install --omit=dev --prefix backend

# ---- Copy backend build output ----
COPY --from=builder /app/backend/dist backend/dist

# ---- Copy frontend build (static files) ----
# Adjust this path if your backend expects a different public folder
COPY --from=builder /app/backend/public backend/public

# ---- Security best practice ----
USER node

EXPOSE 8000

CMD ["npm", "start", "--prefix", "backend"]