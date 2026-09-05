#!/usr/bin/env bash
set -e
echo "🔄 Pulling latest changes from GitHub..."
cd /var/www/Portfolio
git fetch origin
git reset --hard origin/main
npm install
npm run build
pm2 restart rkmidigi-admin-api || pm2 start ecosystem.config.cjs
sudo systemctl reload nginx
echo "✅ RKMIDIGILABS updated successfully!"
