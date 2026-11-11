# Hostinger Production Deployment Guide for AegisKoncept

This guide walks you through deploying the **AegisKoncept** Next.js 14 production website on **Hostinger** (either via Hostinger VPS or Hostinger Cloud/Node.js Hosting).

---

## Method 1: Hostinger VPS Deployment (Recommended)

Hostinger VPS provides maximum performance, reliability, and full control over Node.js, PM2 process management, and Nginx reverse proxy.

### Step 1: Connect to your Hostinger VPS via SSH
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Node.js (v20+ LTS), Git & PM2
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Verify versions
node -v
npm -v

# Install PM2 globally
sudo npm install -g pm2
```

### Step 3: Clone the GitHub Repository
```bash
cd /var/www
git clone https://github.com/aegiskoncept-tech/aegiskoncept.git
cd aegiskoncept
```

### Step 4: Configure Production Environment Variables
```bash
cp .env.example .env
nano .env
```
Set your production values:
```env
DATABASE_URL="file:./dev.db" # Or your Hostinger MySQL connection string
NEXTAUTH_SECRET="your-strong-random-32-char-secret"
NEXTAUTH_URL="https://aegiskoncept.com"
SITE_URL="https://aegiskoncept.com"
LEAD_NOTIFY_EMAIL="hello@aegiskoncept.com"
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="hello@aegiskoncept.com"
SMTP_PASS="your-hostinger-email-password"
```

### Step 5: Install Dependencies & Build
```bash
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run create-admin # Sets up default admin user: admin@aegiskoncept.com
npm run build
```

### Step 6: Start with PM2 Process Manager
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 7: Configure Nginx Reverse Proxy
Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/aegiskoncept.com
```
Add the following configuration:
```nginx
server {
    listen 80;
    server_name aegiskoncept.com www.aegiskoncept.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and test Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/aegiskoncept.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Install Free SSL Certificate (Certbot)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d aegiskoncept.com -d www.aegiskoncept.com
```

---

## Method 2: Hostinger hPanel (Node.js Application Manager)

If using Hostinger's Cloud/Business web hosting plan with the built-in Node.js selector:

1. Log in to **Hostinger hPanel**.
2. Navigate to **Websites** → **Manage** → **Node.js**.
3. Click **Create Application**:
   - **Node.js version:** Select `20.x` or higher.
   - **Application mode:** `Production`.
   - **Application root:** `public_html` or `/home/u123456/aegiskoncept`.
   - **Application startup file:** `node_modules/next/dist/bin/next` or `.next/standalone/server.js`.
4. Upload or clone the repository via Git tool in hPanel.
5. Create `.env` from `.env.example` in file manager.
6. Run build via SSH terminal:
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run prisma:seed
   npm run build
   ```
7. Click **Restart Application** in Hostinger hPanel.

---

## 🔒 Security & Performance Verification Checklist

- [x] `.env` is ignored by git and never committed publicly.
- [x] Strict Honesty Rule enforced: 0 draft client reviews in public HTML.
- [x] Zero horizontal overflow at mobile (390px) and desktop (1440px).
- [x] PM2 cluster mode configured for zero downtime restarts.
- [x] Standalone output optimization enabled in `next.config.js`.
- [x] Edge middleware handling canonical redirects and protected `/admin` paths.

