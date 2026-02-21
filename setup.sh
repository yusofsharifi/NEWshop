#!/bin/bash

# Fashion E-Commerce Store - Server Setup Script
# Ubuntu 22.04 LTS | Node.js + Express + React + SQLite
# Run as: sudo bash setup.sh

set -e

echo "=================================================="
echo "Fashion E-Commerce Server Setup"
echo "Ubuntu 22.04 LTS | Production Deployment"
echo "=================================================="

# Update system packages
echo "📦 Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Node.js 20 LTS
echo "⚙️ Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs npm

# Verify Node.js installation
echo "✓ Node.js $(node --version)"
echo "✓ npm $(npm --version)"

# Install system dependencies
echo "📦 Installing system dependencies..."
apt-get install -y \
    build-essential \
    python3 \
    git \
    curl \
    wget \
    wget \
    sqlite3 \
    libsqlite3-dev

# Install Nginx
echo "🌐 Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx

# Install Certbot for SSL/TLS
echo "🔒 Installing Certbot for Let's Encrypt..."
apt-get install -y certbot python3-certbot-nginx
systemctl enable certbot.timer

# Install PM2 globally
echo "🚀 Installing PM2 process manager..."
npm install -g pm2
pm2 install pm2-logrotate

# Create application user
echo "👤 Creating application user..."
if ! id -u "appuser" > /dev/null 2>&1; then
    useradd -m -s /bin/bash appuser
    echo "✓ User 'appuser' created"
else
    echo "✓ User 'appuser' already exists"
fi

# Create app directory
echo "📁 Creating application directory..."
mkdir -p /app
chown -R appuser:appuser /app
chmod 755 /app

# Setup directories
mkdir -p /app/logs
mkdir -p /app/data
mkdir -p /app/backups
chown -R appuser:appuser /app/logs
chown -R appuser:appuser /app/data
chown -R appuser:appuser /app/backups

# Create database directory with proper permissions
mkdir -p /app/data
sqlite3 /app/data/database.sqlite "VACUUM;" || true
chown appuser:appuser /app/data/database.sqlite
chmod 644 /app/data/database.sqlite

# Configure firewall
echo "🔐 Configuring UFW firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

echo "✓ Firewall configured"

# Setup log rotation
echo "📋 Setting up log rotation..."
cat > /etc/logrotate.d/fashion-store << EOF
/app/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 appuser appuser
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
EOF

# Create swap if needed (for servers with <2GB RAM)
if [ $(free -g | awk '/^Mem:/{print $2}') -lt 2 ]; then
    echo "💾 Creating 2GB swap file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "✓ Swap file created"
fi

# Create systemd service file for PM2
echo "🛠️ Creating systemd service..."
cat > /etc/systemd/system/fashion-store.service << 'EOF'
[Unit]
Description=Fashion E-Commerce Store
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/app
ExecStart=/usr/bin/pm2 start ecosystem.config.js --no-daemon
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable fashion-store

# Create backup script
echo "📦 Creating backup script..."
cat > /app/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/app/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_FILE="/app/data/database.sqlite"

# Backup database
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/database_${TIMESTAMP}.sqlite"
    echo "Database backed up: database_${TIMESTAMP}.sqlite"
fi

# Keep only last 30 backups
cd "$BACKUP_DIR"
ls -t database_*.sqlite | tail -n +31 | xargs -r rm

echo "Backup completed: $TIMESTAMP"
EOF

chmod +x /app/backup.sh
chown appuser:appuser /app/backup.sh

# Add backup cron job (daily at 2 AM)
echo "Adding backup to crontab..."
echo "0 2 * * * /app/backup.sh >> /app/logs/backup.log 2>&1" | crontab -u appuser -

# Security hardening
echo "🔐 Hardening system security..."

# Update SSH config for better security
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Install and configure Fail2Ban
echo "🛡️ Installing Fail2Ban..."
apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Create fail2ban filter for the app
cat > /etc/fail2ban/jail.d/fashion-store.conf << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
EOF

systemctl restart fail2ban

# Install auto-security updates
echo "🔄 Setting up unattended-upgrades..."
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

echo ""
echo "=================================================="
echo "✅ Server Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Clone your repository:"
echo "   sudo -u appuser git clone <repo-url> /app/src"
echo ""
echo "2. Configure environment:"
echo "   sudo -u appuser nano /app/.env"
echo ""
echo "3. Install dependencies:"
echo "   cd /app/src && npm install"
echo ""
echo "4. Build the application:"
echo "   npm run build"
echo ""
echo "5. Configure Nginx:"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/default"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "6. Setup SSL certificate:"
echo "   sudo certbot certonly --nginx -d yourdomain.com"
echo ""
echo "7. Start the application:"
echo "   sudo systemctl start fashion-store"
echo ""
echo "Monitor logs:"
echo "   tail -f /app/logs/error.log"
echo ""
