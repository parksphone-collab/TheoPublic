# THEO DASHBOARD v2.0 — MISSION CONTROL

<div align="center">

```
╔═══════════════════════════════════════════╗
║   THEO DASHBOARD v2.0 — MISSION CONTROL   ║
║                                           ║
║   Status: OPERATIONAL                     ║
║   Security: ENCRYPTED                     ║
║   Build: 2026.02.05                       ║
╚═══════════════════════════════════════════╝
```

**A pixel-military terminal dashboard with 90s strategy game aesthetics**

[Features](#features) • [Installation](#installation) • [Deployment](#deployment) • [API](#api-documentation) • [Widgets](#widgets)

</div>

---

## 🎯 Features

- **17+ Dashboard Widgets** — Activity Feed, Calendar, To-Do, Goals, Weather, Resources, Chat, and more
- **Pixel-Military Aesthetic** — Retro terminal design inspired by 90s strategy games (like pizza.watch)
- **Real-time Updates** — Server-Sent Events (SSE) for live data streaming
- **Fully Responsive** — CSS Grid layout adapts to any screen size
- **Zero Frontend Frameworks** — Pure vanilla JavaScript for maximum performance
- **Mock Data Ready** — Pre-populated with realistic mock data for immediate deployment
- **Extensible Architecture** — Modular routes and widgets for easy customization
- **CRT Effects** — Subtle scanline animations and LED pulse indicators

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- (Optional) nodemon for development

### Installation

```bash
# Clone or extract the project
cd theo-dashboard

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration (optional for now)
nano .env

# Start the server
npm start
```

The dashboard will be available at **http://localhost:3000**

### Development Mode

```bash
# Install nodemon globally (if not already)
npm install -g nodemon

# Run in development mode with auto-reload
npm run dev
```

---

## 📦 Project Structure

```
theo-dashboard/
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .env.example              # Environment template
├── README.md                 # This file
│
├── public/                   # Static frontend files
│   ├── index.html            # Main dashboard HTML
│   ├── css/
│   │   └── style.css         # Pixel-military theme CSS
│   └── js/
│       └── app.js            # Frontend JavaScript
│
└── routes/                   # API route handlers
    ├── activity.js           # Activity feed endpoints
    ├── calendar.js           # Calendar endpoints
    ├── weather.js            # Weather endpoints
    ├── resources.js          # System resource endpoints
    └── sse.js                # Server-Sent Events
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Base Dark** | `#0a0a0f` | Background |
| **Base Light** | `#151520` | Card backgrounds |
| **Military Green** | `#00ff41` | Primary accent, borders |
| **Warning Amber** | `#ffaa00` | Warnings, highlights |
| **Alert Red** | `#ff3333` | Errors, urgent items |
| **Info Blue** | `#00ccff` | Information, links |

### Typography

- **Display Font:** VT323 (Google Fonts) — Headers, titles, metrics
- **Body Font:** Source Code Pro — Body text, inputs

### Card System

- **Square Cards** (1 column): Weather, Goals, To-Do, Notifications, Settings
- **Wide Cards** (2 columns): Activity Feed, Calendar, Chat, Performance, Roadmap
- **Tall Cards** (2 rows): Resource Monitor

---

## 🔌 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Health Check

```http
GET /api/health
```

Returns server status, uptime, and memory usage.

#### System Status

```http
GET /api/status
```

Returns status of all models, integrations, and system metrics.

#### Activity Feed

```http
GET /api/activity?type=all&limit=50
POST /api/activity
DELETE /api/activity/:id
DELETE /api/activity
```

#### Calendar

```http
GET /api/calendar?date=YYYY-MM-DD&type=meeting
GET /api/calendar/:id
POST /api/calendar
PUT /api/calendar/:id
DELETE /api/calendar/:id
```

#### Weather

```http
GET /api/weather?location=Minnetonka, MN
GET /api/weather/forecast?days=7
POST /api/weather/location
```

#### System Resources

```http
GET /api/resources
GET /api/resources/history?hours=24
GET /api/resources/disk
GET /api/resources/memory
GET /api/resources/cpu
```

#### Server-Sent Events (SSE)

```http
GET /api/events
```

Streams real-time updates:
- `activity` — New activity items
- `notification` — New notifications
- `resource-update` — System resource changes

---

## 🧩 Widgets

### Current Widgets (17)

1. **Activity Feed** — Real-time log of system events
2. **Calendar** — Upcoming events and meetings
3. **To-Do List** — Task management with priorities
4. **Goals Tracker** — Progress bars for long-term goals
5. **Weather** — Current conditions and 3-day forecast
6. **Resource Monitor** — CPU, memory, disk usage
7. **Notifications** — Priority alerts and warnings
8. **Token Metrics** — API usage and costs
9. **Security Overview** — API key health and access logs
10. **Chat Interface** — Conversational AI interaction
11. **Widgets Marketplace** — Install additional widgets
12. **Backup/Restore** — Version control and backups
13. **Settings** — Theme, timezone, personality, location
14. **Performance Analytics** — Charts and statistics
15. **Bugs/Issues** — Bug tracker with priorities
16. **Roadmap** — Feature planning with voting
17. **Header Bar** — Live clock, status indicators, integrations

### Adding New Widgets

1. Add HTML structure to `public/index.html`
2. Add styles to `public/css/style.css`
3. Add JavaScript logic to `public/js/app.js`
4. Create API route in `routes/` if needed
5. Update README with widget documentation

---

## 🌐 Deployment

### Namecheap Shared Hosting (Node.js)

#### Requirements

- cPanel with "Setup Node.js App" feature
- SSH access
- Node.js >= 18.x available

#### Steps

1. **Prepare the deployment package**

```bash
# In your local theo-dashboard directory
zip -r theo-dashboard.zip . -x "*.git*" "node_modules/*"
```

2. **Upload to server**

```bash
# Using SSH
scp theo-dashboard.zip pgsvkqjg@198.54.116.221:/home/pgsvkqjg/

# Or use cPanel File Manager to upload the ZIP
```

3. **Extract on server**

```bash
# Connect via SSH
ssh pgsvkqjg@198.54.116.221 -p 21098

# Navigate to deployment directory
cd /home/pgsvkqjg/theo

# Extract files
unzip ../theo-dashboard.zip

# Install dependencies
npm install --production
```

4. **Configure Node.js App in cPanel**

- Login to cPanel
- Navigate to **Software → Setup Node.js App**
- Click **Create Application**
- Settings:
  - **Node.js version:** 18.x or higher
  - **Application mode:** Production
  - **Application root:** `/home/pgsvkqjg/theo`
  - **Application URL:** `pgs-ventures.com/theo` (or subdomain)
  - **Application startup file:** `server.js`
  - **Environment variables:** Copy from `.env`

5. **Start the application**

```bash
# In cPanel Node.js App interface, click "Start App"
# Or via SSH:
node server.js
```

6. **Configure proxy (if needed)**

If serving at a subdirectory (e.g., `/theo`), configure `.htaccess`:

```apache
RewriteEngine On
RewriteRule ^theo/(.*)$ http://localhost:PORT/$1 [P,L]
```

Replace `PORT` with the port assigned by cPanel.

#### Troubleshooting

**Port issues:**
- Use `process.env.PORT` (cPanel assigns this automatically)
- Check cPanel Node.js App for assigned port

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**App not starting:**
- Check logs in cPanel Node.js App interface
- Verify Node.js version: `node --version`
- Check for syntax errors: `node -c server.js`

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=production

# Add API keys for integrations:
# - OpenAI, Anthropic, OpenRouter (for AI models)
# - Gmail API (for email integration)
# - Discord Bot (for Discord integration)
# - Weather API (for weather widget)
```

### Cron Jobs

Configured in `server.js`:

- **System resources** — Every 5 minutes
- **Daily backup** — 2:00 AM daily
- **Token expiration check** — 9:00 AM daily

Modify or add cron jobs:

```javascript
cron.schedule('0 */6 * * *', () => {
    console.log('[CRON] Running custom task...');
    // Your code here
});
```

---

## 🎯 Roadmap

### Phase 1: Frontend UI ✅ **COMPLETE**
- [x] Pixel-military design system
- [x] 17 dashboard widgets with mock data
- [x] Responsive grid layout
- [x] CRT scanline effects and animations

### Phase 2: Backend Integration 🚧 **NEXT**
- [ ] Connect real API endpoints
- [ ] Gmail integration
- [ ] Discord bot integration
- [ ] Weather API integration
- [ ] Calendar sync (Google Calendar)
- [ ] SSH monitoring

### Phase 3: Real-time Features
- [ ] WebSocket or SSE for live updates
- [ ] Activity feed auto-refresh
- [ ] Resource monitoring (actual system stats)
- [ ] Notification system with push

### Phase 4: Advanced Features
- [ ] User authentication
- [ ] Multiple dashboards
- [ ] Custom widget builder
- [ ] Mobile app (PWA)
- [ ] Team collaboration features

---

## 📝 Notes

### Mock Data

All widgets currently display realistic mock data. To replace with real data:

1. Implement actual API calls in route files (`routes/*.js`)
2. Update frontend JavaScript (`public/js/app.js`) to fetch from APIs
3. Remove mock data generators and replace with live integrations

Comments marked `// TODO: Replace with real API call` indicate where to add real implementations.

### Performance

- **CSS Grid** — Efficient responsive layout
- **Vanilla JS** — No framework overhead (~13KB JS total)
- **Canvas Charts** — Lightweight data visualization
- **SSE** — More efficient than WebSocket polling for one-way updates
- **Caching** — Resource endpoints cache for 5 seconds

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support (uses CSS Grid, modern JS)

---

## 🤝 Contributing

This is a proprietary project for PGS Ventures / Theo AI. Internal contributions welcome.

---

## 📄 License

MIT License — Copyright (c) 2026 PGS Ventures

---

## 🔗 Links

- **Live Demo:** TBD
- **GitHub Repo:** TBD (if applicable)
- **Server:** pgs-ventures.com/theo
- **Inspiration:** https://pizza.watch

---

<div align="center">

**Built with 💚 by Theo AI • Powered by OpenClaw**

```
"Excellence is not an act, but a habit."
```

</div>
