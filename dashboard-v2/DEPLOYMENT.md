# 🚀 DEPLOYMENT GUIDE - cPanel (Namecheap Shared Hosting)

Complete step-by-step guide for deploying THEO Dashboard v2.0 to pgs-ventures.com via cPanel.

---

## 📋 Prerequisites

- ✅ cPanel access to pgs-ventures.com
- ✅ SSH access (key configured: `~/.ssh/theo_key`)
- ✅ Node.js available on hosting (check with host support)
- ✅ Domain configured: pgs-ventures.com

---

## 🎯 Deployment Options

### Option A: Automated Deployment (Recommended)

Use the included deployment script:

```bash
# From your local machine
cd theo-dashboard
./deploy.sh
```

This will:
1. Create a timestamped archive
2. Upload to server via SCP
3. Extract files to `/home/pgsvkqjg/theo/`
4. Install dependencies
5. Set up `.env` if needed

### Option B: Manual Deployment

Follow the steps below for complete control.

---

## 📦 OPTION B: Manual Step-by-Step Deployment

### Step 1: Prepare Files Locally

```bash
# Test that everything works locally first
cd theo-dashboard
npm install
npm start

# Visit http://localhost:3000 to verify
```

### Step 2: Create Deployment Archive

```bash
# Create archive (exclude unnecessary files)
tar -czf theo-dashboard.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.env' \
  .

# Verify archive
tar -tzf theo-dashboard.tar.gz | head -20
```

### Step 3: Upload to Server

**Via SSH/SCP:**
```bash
# Upload archive
scp -P 21098 -i ~/.ssh/theo_key \
  theo-dashboard.tar.gz \
  pgsvkqjg@pgs-ventures.com:/home/pgsvkqjg/

# SSH into server
ssh -p 21098 -i ~/.ssh/theo_key pgsvkqjg@pgs-ventures.com
```

**Via cPanel File Manager:**
1. Log into cPanel at pgs-ventures.com/cpanel
2. Open **File Manager**
3. Navigate to `/home/pgsvkqjg/`
4. Click **Upload** and select `theo-dashboard.tar.gz`
5. Wait for upload to complete

### Step 4: Extract Files on Server

```bash
# SSH session
cd /home/pgsvkqjg

# Create directory
mkdir -p theo
cd theo

# Extract archive
tar -xzf ../theo-dashboard.tar.gz

# Verify extraction
ls -la
# Should see: server.js, package.json, routes/, public/, etc.

# Clean up
rm ../theo-dashboard.tar.gz
```

### Step 5: Install Dependencies

```bash
# Still in SSH session, in /home/pgsvkqjg/theo
npm install --production

# This may take 2-5 minutes
# Watch for any errors
```

### Step 6: Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**Minimal .env configuration:**
```env
PORT=3000
NODE_ENV=production
AUTH_TOKEN=          # Leave blank for now (can add later)
```

**Press Ctrl+X, then Y, then Enter to save**

### Step 7: Set Up Node.js App in cPanel

1. **Log into cPanel**
   - URL: https://pgs-ventures.com:2083
   - Username: pgsvkqjg
   - Password: [your password]

2. **Find "Setup Node.js App"**
   - Scroll to **SOFTWARE** section
   - Click **Setup Node.js App**

3. **Click "Create Application"**

4. **Fill in Application Settings:**

   | Field | Value |
   |-------|-------|
   | **Node.js version** | 16.x or higher (latest available) |
   | **Application mode** | Production |
   | **Application root** | `/home/pgsvkqjg/theo` |
   | **Application URL** | `theo` |
   | **Application startup file** | `server.js` |
   | **Passenger log file** | (leave default) |

5. **Environment Variables** (click "Add Variable" for each):
   
   | Variable Name | Value |
   |---------------|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | (leave blank - cPanel assigns automatically) |

6. **Click "CREATE"**

7. **Note the assigned port** (shown after creation, usually 3000-4000 range)

### Step 8: Configure Application

After creation, you'll see:

```
Application created successfully
Port: 12345 (example)
```

**Update .env with cPanel-assigned port:**
```bash
# Back in SSH
nano /home/pgsvkqjg/theo/.env

# Add or update:
PORT=12345  # Use the actual port cPanel assigned
```

### Step 9: Start/Restart Application

**Via cPanel Interface:**
1. In **Setup Node.js App**, find your app
2. Click **Restart** button (or **Start** if not running)
3. Status should show: "Running" with green indicator

**Via SSH (alternative):**
```bash
cd /home/pgsvkqjg/theo
npm start
```

### Step 10: Verify Deployment

1. **Open browser**
2. **Visit:** `https://pgs-ventures.com/theo`
3. **Expected result:**
   - Dashboard loads with military terminal theme
   - Clock updates every second
   - Green pulsing LEDs in header
   - All widgets render with mock data
   - No console errors (check browser DevTools)

---

## ✅ Post-Deployment Checklist

- [ ] Dashboard loads at `/theo` URL
- [ ] Live clock updating
- [ ] All LED indicators showing status
- [ ] Activity feed displays entries
- [ ] Calendar widget shows events
- [ ] Resource monitor displays server stats
- [ ] Weather widget shows data
- [ ] Notifications render
- [ ] Chat interface accepts commands
- [ ] No JavaScript errors in browser console
- [ ] WebSocket connects (or falls back to polling)

---

## 🔧 Troubleshooting

### Issue: Dashboard Shows 404 Not Found

**Cause:** Application URL misconfigured or app not running

**Solutions:**
1. Check cPanel Node.js App status (should be "Running")
2. Verify Application URL is set to `theo`
3. Restart application in cPanel
4. Check `.htaccess` in `/home/pgsvkqjg/public_html/theo/` (should not exist - app is outside public_html)

### Issue: Dashboard Loads but Shows Errors

**Cause:** Dependencies not installed or PORT misconfigured

**Solutions:**
```bash
# SSH into server
ssh -p 21098 -i ~/.ssh/theo_key pgsvkqjg@pgs-ventures.com
cd /home/pgsvkqjg/theo

# Reinstall dependencies
rm -rf node_modules
npm install --production

# Check .env PORT matches cPanel assignment
cat .env
```

### Issue: WebSocket Connection Failed

**Cause:** Shared hosting may block WebSockets

**Solution:** Dashboard automatically falls back to polling (no action needed)

**To verify:**
1. Open browser DevTools → Network tab
2. Look for WebSocket connection attempt
3. If failed, check Console for "Falling back to polling mode" message
4. Dashboard will work normally via polling

### Issue: Blank Page / Won't Load

**Cause:** Static files not being served

**Solutions:**
1. Verify `public/` directory exists and contains files
2. Check server.js has: `app.use(express.static(path.join(__dirname, 'public')));`
3. Check file permissions: `chmod -R 755 /home/pgsvkqjg/theo/public`

### Issue: API Endpoints Return 500 Errors

**Cause:** Server-side errors

**Solutions:**
```bash
# Check application logs in cPanel
# Or via SSH:
cd /home/pgsvkqjg/theo
tail -f logs/*.log  # if logging enabled

# Check Node.js process
ps aux | grep node

# Restart app
# (via cPanel interface or kill process and restart)
```

---

## 🔄 Updating the Dashboard

### Quick Update Process

```bash
# Local machine: make changes, then
cd theo-dashboard
./deploy.sh

# SSH into server
ssh -p 21098 -i ~/.ssh/theo_key pgsvkqjg@pgs-ventures.com
cd /home/pgsvkqjg/theo

# If package.json changed, reinstall
npm install --production

# Restart via cPanel Node.js App interface
```

### Rolling Back

```bash
# SSH into server
cd /home/pgsvkqjg

# List backups
ls -ld theo-backup-*

# Restore from backup
rm -rf theo
mv theo-backup-YYYYMMDD-HHMMSS theo

# Restart app via cPanel
```

---

## 📊 Monitoring

### Check Application Status

**Via cPanel:**
1. Setup Node.js App → View your application
2. Shows: Status (Running/Stopped), Memory usage, Restart count

**Via SSH:**
```bash
# Check if process is running
ps aux | grep "node.*server.js"

# Check port listening
netstat -tlnp | grep :12345  # replace with your port

# Test API
curl http://localhost:12345/api/status
```

### View Logs

**cPanel:**
- Setup Node.js App → Click application → View logs

**SSH:**
```bash
# Application logs (if configured)
tail -f /home/pgsvkqjg/theo/logs/app.log

# Error output
# (check cPanel interface for stderr log location)
```

---

## 🔐 Security Recommendations

### Enable Authentication

```bash
# SSH into server
nano /home/pgsvkqjg/theo/.env

# Generate secure token (on your local machine):
openssl rand -hex 32

# Add to .env:
AUTH_TOKEN=your_generated_token_here

# Restart app via cPanel
```

**Access protected endpoints:**
```
https://pgs-ventures.com/theo?token=your_generated_token_here
```

### SSL/HTTPS

✅ Already enabled via cPanel's AutoSSL (Let's Encrypt)  
Dashboard accessible at: `https://pgs-ventures.com/theo`

### Firewall

Shared hosting handles firewall automatically.  
Node.js app only accessible via cPanel proxy, not directly exposed.

---

## 🎯 Performance Optimization

### Enable Production Mode

Already set via:
```env
NODE_ENV=production
```

### Optimize Dependencies

```bash
# Remove dev dependencies
npm prune --production

# Clear npm cache
npm cache clean --force
```

### Restart Schedule

Consider setting up a cron job to restart app weekly:
1. cPanel → Cron Jobs
2. Add: `0 2 * * 0 cd /home/pgsvkqjg/theo && npm restart`
   (Restarts every Sunday at 2 AM)

---

## 📞 Support Contacts

**Hosting Provider:** Namecheap  
**Support:** https://www.namecheap.com/support/

**cPanel Issues:**
- Contact Namecheap support
- Provide: Account details, domain, error messages

**Dashboard Issues:**
- Check this guide first
- Review logs in cPanel
- Test locally to isolate hosting vs. code issues

---

## ✅ Deployment Complete!

Your dashboard should now be live at:

**🌐 https://pgs-ventures.com/theo**

```
╔═══════════════════════════════════════╗
║   THEO DASHBOARD v2.0 - DEPLOYED     ║
║   Status: OPERATIONAL                 ║
║   Mission: SUCCESS ✅                 ║
╚═══════════════════════════════════════╝
```

Enjoy your military-grade mission control interface! 🎖️
