# Production Deployment Guide

Fashion E-Commerce Store - Vite + React + Express + SQLite  
**Target**: Ubuntu 22.04 LTS | Node.js 20 LTS | Nginx | PM2

---

## 📋 Prerequisites

### System Requirements
- Ubuntu 22.04 LTS or compatible
- Minimum: 2GB RAM, 20GB disk space
- Recommended: 4GB+ RAM, 40GB+ disk space
- Domain name with DNS configured
- SSH access to server

### Tools Required
- Git
- Node.js 20 LTS
- npm/yarn

---

## 🚀 Quick Start (Automated Setup)

### Step 1: SSH into your server
```bash
ssh root@yourdomain.com
```

### Step 2: Download and run setup script
```bash
curl -fsSL https://raw.githubusercontent.com/yourusername/fashion-store/main/setup.sh | sudo bash
```

This automated script will:
- ✅ Update system packages
- ✅ Install Node.js 20 LTS
- ✅ Install Nginx and SSL support
- ✅ Install PM2 for process management
- ✅ Create app user and directories
- ✅ Configure firewall
- ✅ Setup automatic backups
- ✅ Configure Fail2Ban security
- ✅ Enable auto-security updates

### Step 3: Manual configuration steps

#### Clone the repository
```bash
sudo -u appuser -i
cd /app/src
git clone https://github.com/yourusername/fashion-store.git .
```

#### Setup environment variables
```bash
cp .env.example .env
nano .env
```

**Critical settings to update:**
```env
NODE_ENV=production
APP_URL=https://yourdomain.com
JWT_SECRET=<generate-secure-random-key>
SESSION_SECRET=<generate-secure-random-key>
DB_PATH=/app/data/database.sqlite
```

**Generate secure keys:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Install dependencies and build
```bash
cd /app/src
npm install
npm run build
```

#### Initialize database
```bash
# Ensure database directory exists
mkdir -p /app/data
sqlite3 /app/data/database.sqlite ".tables"

# Run any migrations
npm run migrate --if-present
```

#### Setup Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo nano /etc/nginx/sites-available/default
# Update: yourdomain.com with your actual domain
sudo nginx -t
sudo systemctl reload nginx
```

#### Setup SSL Certificate (Let's Encrypt)
```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

**Update nginx.conf with certificate paths:**
```bash
sudo nano /etc/nginx/sites-available/default
# Update paths in lines with ssl_certificate and ssl_certificate_key
```

### Step 4: Start the application
```bash
sudo systemctl start fashion-store
sudo systemctl status fashion-store
```

### Step 5: Verify deployment
```bash
# Check application is running
curl http://localhost:3000/health

# Check logs
tail -f /app/logs/combined.log
```

---

## 🔄 Continuous Deployment (GitHub Actions)

### Setup GitHub Secrets

Navigate to: `Settings > Secrets and variables > Actions`

Add the following secrets:

```
STAGING_HOST=staging.yourdomain.com
STAGING_USER=appuser
STAGING_SSH_KEY=<your-private-ssh-key>

PROD_HOST=yourdomain.com
PROD_USER=appuser
PROD_SSH_KEY=<your-private-ssh-key>

SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SNYK_TOKEN=<your-snyk-token>
```

### Generate SSH Key for GitHub
```bash
ssh-keygen -t ed25519 -f deployment_key -N ""
# Add public key to ~/.ssh/authorized_keys on server
# Add private key to GitHub Secrets as PROD_SSH_KEY
```

### Deployment Workflow

**Develop branch** → Staging environment  
**Main branch** → Production environment

Push to trigger automatic:
- ✅ Tests
- ✅ Linting
- ✅ Security scanning
- ✅ Build verification
- ✅ Automated deployment
- ✅ Health checks
- ✅ Slack notifications

---

## 📊 Monitoring & Management

### PM2 Management
```bash
# View running processes
pm2 list

# Monitor in real-time
pm2 monit

# View logs
pm2 logs fashion-store
pm2 logs fashion-store --lines 100
pm2 logs fashion-store --err

# Restart application
pm2 restart fashion-store

# Stop application
pm2 stop fashion-store

# Start application
pm2 start ecosystem.config.js --env production

# Reload with zero-downtime
pm2 reload fashion-store
```

### Database Backups
```bash
# Manual backup
/app/backup.sh

# View backups
ls -lh /app/backups/

# Restore from backup
sqlite3 /app/data/database.sqlite < /app/backups/database_TIMESTAMP.sqlite
```

### View Logs
```bash
# Application logs
tail -f /app/logs/combined.log
tail -f /app/logs/error.log

# Nginx logs
tail -f /app/logs/nginx_access.log
tail -f /app/logs/nginx_error.log

# System logs
sudo journalctl -u fashion-store -f
```

---

## 🔐 Security Checklist

- [ ] Change default SSH port (optional but recommended)
- [ ] Enable SSH key authentication only (disable passwords)
- [ ] Install and configure UFW firewall
- [ ] Install and configure Fail2Ban
- [ ] Setup SSL/TLS certificate
- [ ] Enable HSTS header
- [ ] Configure rate limiting
- [ ] Setup regular backups
- [ ] Monitor failed login attempts
- [ ] Regularly update dependencies: `npm audit fix`
- [ ] Rotate security keys monthly
- [ ] Monitor server resources

### Check SSL Configuration
```bash
# Test SSL strength
curl -I https://yourdomain.com

# Get SSL certificate info
openssl s_client -connect yourdomain.com:443 -showcerts

# Test with SSL Labs
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

---

## 🐛 Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs fashion-store --err

# Check if port 3000 is available
lsof -i :3000

# Check environment variables
cat /app/.env

# Verify database
sqlite3 /app/data/database.sqlite ".dbinfo"
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check error log
sudo tail -f /app/logs/nginx_error.log

# Verify upstream
curl http://localhost:3000/health
```

### Out of memory
```bash
# Check memory usage
free -h

# Restart application (may free memory)
pm2 restart fashion-store

# Increase Node heap size in ecosystem.config.js
# node_args: '--max_old_space_size=1024'
```

### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew --force-renewal

# Test auto-renewal
sudo certbot renew --dry-run

# Check certificate expiration
sudo openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -noout -dates
```

---

## 📈 Performance Tuning

### Database Optimization
```bash
# Analyze database
sqlite3 /app/data/database.sqlite "ANALYZE;"

# Vacuum (cleanup)
sqlite3 /app/data/database.sqlite "VACUUM;"

# Check database size
du -h /app/data/database.sqlite
```

### Node.js Memory Settings
Edit `ecosystem.config.js`:
```javascript
node_args: '--max_old_space_size=1024 --max_semi_space_size=1024'
```

### Nginx Caching
Already configured with:
- Gzip compression
- Client-side caching for static assets (1 year)
- Proxy response buffering

### Enable Redis Caching (Optional)
```bash
sudo apt-get install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

---

## 🔄 Rollback Procedure

### Automatic Rollback (GitHub Actions)
```bash
# Trigger workflow_dispatch in GitHub
# Select "Rollback" workflow to revert to previous commit
```

### Manual Rollback
```bash
cd /app/src
git log --oneline -5
git reset --hard <commit-hash>
npm run build
pm2 reload fashion-store
```

---

## 📦 Updates & Maintenance

### Update Dependencies
```bash
cd /app/src
npm update
npm audit fix
npm run build
pm2 reload fashion-store
```

### Update Node.js
```bash
# New version will be installed automatically
# via unattended-upgrades

# Manual update if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get upgrade nodejs
```

### Update Application
```bash
cd /app/src
git pull origin main
npm install
npm run build
pm2 reload fashion-store
```

---

## 🆘 Support & Resources

### Log Locations
- Application: `/app/logs/combined.log`
- Errors: `/app/logs/error.log`
- Nginx Access: `/app/logs/nginx_access.log`
- Nginx Errors: `/app/logs/nginx_error.log`
- Backups: `/app/backups/`

### Useful Commands
```bash
# SSH to server
ssh -i <key> appuser@yourdomain.com

# Copy files from server
scp -i <key> appuser@yourdomain.com:/app/logs/combined.log ./

# Monitor in real-time
watch 'pm2 list && echo "---" && free -h && echo "---" && df -h'
```

### Getting Help
- Check logs first
- Review deployment.md
- Check GitHub Actions runs
- Monitor server health
- Review Nginx configuration

---

## 📞 Emergency Contacts

### Common Issues
1. **500 errors**: Check `/app/logs/error.log`
2. **High CPU**: Check `pm2 monit`
3. **Database errors**: Check `/app/data/database.sqlite` permissions
4. **SSL issues**: Check `/etc/letsencrypt/live/yourdomain.com/`

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Security scan completed
- [ ] Environment variables configured
- [ ] Database backups working
- [ ] SSL certificate installed
- [ ] Nginx configuration validated
- [ ] Firewall rules active
- [ ] PM2 process configured
- [ ] Monitoring setup
- [ ] Slack notifications configured
- [ ] GitHub Actions secrets added
- [ ] SSH keys generated and secured

---

**Last Updated**: 2024
**Version**: 1.0.0
