# THEO DASHBOARD v2.0 — QUICK START GUIDE

## ⚡ 60-Second Setup

```bash
# 1. Navigate to project
cd theo-dashboard

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

**Open in browser:** http://localhost:3000

That's it! 🎉

---

## 🎨 What You'll See

A stunning pixel-military terminal dashboard with:

- **Fixed header bar** with live UTC clock and pulsing LED status indicators
- **17 interactive widgets** in a responsive grid layout:
  - Activity Feed with filter buttons
  - Calendar with upcoming events
  - To-Do list with checkboxes
  - Goals with progress bars
  - Current weather + 3-day forecast
  - System resource monitor (CPU, Memory, Disk)
  - Priority notifications
  - Token usage metrics with sparkline chart
  - Security overview with API health
  - Chat interface with quick commands
  - Widgets marketplace
  - Backup/restore controls
  - Settings panel
  - Performance analytics with bar chart
  - Bug/issue tracker
  - Product roadmap with voting

**All widgets display realistic mock data** and are fully styled with the pixel-military aesthetic.

---

## 🎯 Customization

### Change the Port

```bash
PORT=8080 npm start
```

Or edit `.env`:
```env
PORT=8080
```

### Add Your Location

Edit `public/index.html` and search for "Minnetonka, MN" — replace with your city.

### Modify Colors

Edit `public/css/style.css` at the top:

```css
:root {
    --color-military-green: #00ff41;  /* Change primary accent */
    --color-warning: #ffaa00;         /* Change warning color */
    --color-alert: #ff3333;           /* Change alert color */
}
```

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get Activity Feed
```bash
curl http://localhost:3000/api/activity
```

### Get System Resources
```bash
curl http://localhost:3000/api/resources
```

### Get Calendar Events
```bash
curl http://localhost:3000/api/calendar
```

### Get Weather
```bash
curl http://localhost:3000/api/weather
```

---

## 🚀 Development Mode

Auto-reload on file changes:

```bash
npm run dev
```

Requires `nodemon` (installed as dev dependency).

---

## 📋 Next Steps

### Phase 2: Connect Real Data

1. **Gmail Integration**
   - Add credentials to `.env`
   - Update `routes/activity.js` to fetch real emails
   
2. **Weather API**
   - Get API key from OpenWeatherMap or WeatherAPI
   - Update `routes/weather.js` with real API calls
   
3. **Calendar Sync**
   - Connect Google Calendar API
   - Update `routes/calendar.js`

4. **System Resources**
   - Already pulling real CPU/Memory data!
   - Add `diskusage` npm package for real disk stats

### Deploy to Production

See `README.md` deployment section or run:

```bash
./deploy.sh
```

This creates a ZIP package ready to upload to your server.

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
PORT=3001 npm start
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Can't access from another device:**
- Server binds to localhost only by default
- For LAN access, modify `server.js`:
  ```javascript
  app.listen(PORT, '0.0.0.0', () => { ... });
  ```

---

## 💡 Tips

- **Live clock** updates every second in the header
- **Resource monitor** refreshes every 5 seconds
- **Canvas charts** render sparklines and bar charts
- **CRT scanline effect** is subtle — look closely!
- **LED indicators** pulse with CSS animations
- **Hover effects** on cards create a glow
- **Button press** animations depress on click

---

## 📱 Mobile View

The dashboard is fully responsive! Try resizing your browser or opening on mobile:

- Header collapses to vertical layout
- Grid becomes single column
- All widgets remain functional
- Touch-friendly buttons and inputs

---

## 🎉 You're Ready!

The dashboard is now running with all 17 widgets displaying mock data. Start customizing, connect your real data sources, and make it yours!

**Questions?** Check the full `README.md` for detailed documentation.

---

<div align="center">

**Built with 💚 by Theo AI**

```
╔═══════════════════════════════════════════╗
║          MISSION CONTROL ONLINE           ║
╚═══════════════════════════════════════════╝
```

</div>
