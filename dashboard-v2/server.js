// ============================================
// THEO DASHBOARD v2.0 — EXPRESS SERVER
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// ROUTES
// ============================================

// Import route modules
const activityRoutes = require('./routes/activity');
const calendarRoutes = require('./routes/calendar');
const weatherRoutes = require('./routes/weather');
const resourceRoutes = require('./routes/resources');
const sseRoutes = require('./routes/sse');

// Mount routes
app.use('/api/activity', activityRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', sseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '2.0.0'
    });
});

// Status endpoint with all system info
app.get('/api/status', (req, res) => {
    res.json({
        models: {
            kimi: { status: 'online', latency: 120 },
            grok: { status: 'online', latency: 145 },
            gpt: { status: 'warning', latency: 230 }
        },
        integrations: {
            gmail: { status: 'online', lastSync: Date.now() - 120000 },
            discord: { status: 'online', lastSync: Date.now() - 60000 },
            calendar: { status: 'online', lastSync: Date.now() - 180000 },
            ssh: { status: 'online', lastCheck: Date.now() - 30000 }
        },
        system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        }
    });
});

// ============================================
// CRON JOBS (Examples)
// ============================================

// Check system resources every 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log('[CRON] Checking system resources...');
    // TODO: Implement actual resource monitoring
});

// Daily backup at 2 AM
cron.schedule('0 2 * * *', () => {
    console.log('[CRON] Running daily backup...');
    // TODO: Implement backup logic
});

// Check for expired tokens daily
cron.schedule('0 9 * * *', () => {
    console.log('[CRON] Checking for expired API tokens...');
    // TODO: Implement token expiration checks
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        message: 'The requested resource does not exist'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   THEO DASHBOARD v2.0 — MISSION CONTROL   ║
║                                           ║
║   Status: OPERATIONAL                     ║
║   Port: ${PORT.toString().padEnd(36)} ║
║   Environment: ${process.env.NODE_ENV || 'development'.padEnd(27)} ║
║                                           ║
║   Dashboard: http://localhost:${PORT}        ║
╚═══════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[SERVER] SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('[SERVER] HTTP server closed');
    });
});

process.on('SIGINT', () => {
    console.log('[SERVER] SIGINT signal received: closing HTTP server');
    process.exit(0);
});

module.exports = app;
