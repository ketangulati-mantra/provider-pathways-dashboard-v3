FROM node:20-alpine AS builder
WORKDIR /app

# Copy root and backend package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install root & backend dependencies
RUN npm ci || npm i
RUN cd backend && (npm ci || npm i)

# Copy source files
COPY . .

# Build frontend static bundle
RUN npm run build

# Build backend TypeScript
RUN cd backend && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend/dist ./backend/dist

# Install production dependencies only
RUN npm ci --omit=dev || npm i --only=production
RUN cd backend && (npm ci --omit=dev || npm i --only=production)

EXPOSE 80
CMD ["node", "backend/dist/server.js"]