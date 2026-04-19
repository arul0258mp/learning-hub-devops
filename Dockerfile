FROM node:18

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend
COPY backend ./backend

# Copy frontend files (root HTML + assets)
COPY *.html ./
COPY css ./css
COPY js ./js
COPY data ./data

EXPOSE 3001

CMD ["node", "backend/server.js"]