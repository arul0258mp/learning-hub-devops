# 🌐 Hosting & Deployment Guide

This guide explains how to deploy the **Study Bot AI Assistant** to a production environment.

## Recommended: Container-based Hosting (Render / Railway)

Since the project already includes a `Dockerfile` and `docker-compose.yml`, the easiest way to host is using a platform that supports Docker.

### 1. Railway.app (Easiest)
1.  **Push your code** to a GitHub repository.
2.  Log in to [Railway](https://railway.app/).
3.  Click **"New Project"** → **"Deploy from GitHub repo"**.
4.  Railway will automatically detect the `Dockerfile`.
5.  Go to the **Variables** tab and add:
    -   `GROQ_API_KEY`: Your Groq API key (from console.groq.com).
    -   `JWT_SECRET`: A long, random string (e.g., `openssl rand -base64 32`).
    -   `NODE_ENV`: `production`
6.  Railway will build and deploy the container. You'll get a public URL like `studybot-production.up.railway.app`.

### 2. Render.com
1.  **Push your code** to GitHub.
2.  Log in to [Render](https://render.com/).
3.  Click **"New"** → **"Web Service"**.
4.  Connect your GitHub repo.
5.  Choose **"Docker"** as the Runtime.
6.  Add Environment Variables (same as above).
7.  Deploy!

---

## Alternative: Manual VPS Hosting (Ubuntu/Debian)

If you have a VPS (DigitalOcean, AWS EC2, Linode), follow these steps:

1.  **Install Node.js & Docker**:
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose nodejs npm
    ```
2.  **Clone your repo**:
    ```bash
    git clone https://github.com/your-username/learning-hub-bot.git
    cd learning-hub-bot/learning-hub-devops
    ```
3.  **Setup Environment**:
    -   `cp backend/.env.example backend/.env`
    -   Edit `backend/.env` with your production keys.
4.  **Run with Docker Compose**:
    ```bash
    docker-compose up -d --build
    ```
5.  **Setup Reverse Proxy (Nginx)**:
    Point your domain to port 3001.

---

## 🔧 Post-Deployment Checklist

- [ ] **Check Health**: Visit `https://your-domain.com/api/health` to confirm the backend is up.
- [ ] **Verify CORS**: Ensure the `FRONTEND_URL` in `.env` matches your production domain.
- [ ] **Data Persistence**: The project uses local JSON files in `backend/data`. Ensure this directory is mounted as a volume in Docker (already handled in `docker-compose.yml`).
- [ ] **HTTPS**: Platforms like Railway and Render handle SSL/TLS automatically. If using a VPS, use **Certbot** for free SSL.

## 🚀 Troubleshooting Chatbot Issues
If the chatbot doesn't respond on your hosted site:
1.  **Check Logs**: Look at the container logs for "Groq API Error".
2.  **Verify Keys**: Ensure the `GROQ_API_KEY` is set correctly in the environment variables (not just in a local `.env` file that isn't committed).
3.  **Check API URL**: Open the browser console (F12) and check if requests are going to `/api/chat`.
