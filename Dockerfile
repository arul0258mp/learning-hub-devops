FROM node:18

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend
COPY backend ./backend

# Copy frontend files
COPY frontend ./frontend

EXPOSE 3001

CMD ["node", "backend/server.js"]