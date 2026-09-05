#!/usr/bin/env bash
# ==============================================================================
# RKMIDIGILABS - Oracle Cloud Infrastructure (OCI) Always Free Auto-Deploy Script
# Supported OS: Ubuntu 22.04 LTS / 24.04 LTS (AMD64 & ARM64 Ampere)
# ==============================================================================

set -e

echo "🚀 [1/6] Updating system packages & configuring firewall..."
sudo apt-get update -y
sudo apt-get install -y curl git ufw iptables-persistent

# Open Oracle Cloud OS-level iptables rules for Port 80 & 443
if command -v iptables &> /dev/null; then
    echo "Configuring iptables for ports 80 and 443..."
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
    sudo netfilter-persistent save || true
fi

# Also allow in UFW if enabled
if sudo ufw status | grep -q "Status: active"; then
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 22/tcp
fi

echo "📦 [2/6] Installing Node.js 20 LTS & PM2..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

sudo npm install -g pm2

echo "🌐 [3/6] Installing & Configuring Nginx..."
sudo apt-get install -y nginx

# Setup project directory
APP_DIR="/var/www/Portfolio"
sudo mkdir -p /var/www

if [ ! -d "$APP_DIR/.git" ]; then
    echo "Cloning repository to $APP_DIR..."
    sudo git clone https://github.com/rkmextentia/Portfolio.git "$APP_DIR"
else
    echo "Updating existing repository at $APP_DIR..."
    cd "$APP_DIR"
    sudo git fetch origin
    sudo git reset --hard origin/main
fi

sudo chown -R $USER:$USER "$APP_DIR"
cd "$APP_DIR"

echo "⚙️ [4/6] Installing dependencies and building Astro site..."
npm install
npm run build

echo "🔄 [5/6] Launching Admin API Server with PM2..."
pm2 delete rkmidigi-admin-api || true
pm2 start ecosystem.config.cjs
pm2 save
# Setup PM2 to revive on server reboot
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME || true

echo "🔗 [6/6] Configuring Nginx Reverse Proxy..."
sudo cp nginx/portfolio.conf /etc/nginx/sites-available/portfolio
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx

PUBLIC_IP=$(curl -s https://api.ipify.org || echo "YOUR-ORACLE-VM-IP")

echo ""
echo "=========================================================================="
echo "🎉 DEPLOYMENT COMPLETE! RKMIDIGILABS is LIVE on Oracle Cloud Always Free"
echo "=========================================================================="
echo "🌐 Live Public Site:     http://$PUBLIC_IP/"
echo "⚙️ Admin Content Studio: http://$PUBLIC_IP/admin/"
echo "🩺 API Health Check:     http://$PUBLIC_IP/api/admin/health"
echo "=========================================================================="
echo "Tip: To attach your custom domain and free SSL certificate:"
echo "     sudo apt-get install -y certbot python3-certbot-nginx"
echo "     sudo certbot --nginx -d yourdomain.com"
echo "=========================================================================="
