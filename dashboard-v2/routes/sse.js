// ============================================
// SERVER-SENT EVENTS (SSE) ROUTES
// ============================================

const express = require('express');
const router = express.Router();

// Store active SSE connections
const clients = new Set();

// Send event to all connected clients
function broadcast(event, data) {
    clients.forEach(client => {
        client.write(`event: ${event}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

// GET /api/events - SSE endpoint
router.get('/', (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    
    // Send initial connection message
    res.write(`event: connected\n`);
    res.write(`data: ${JSON.stringify({ message: 'SSE connection established', timestamp: Date.now() })}\n\n`);
    
    // Add this client to the set
    clients.add(res);
    
    console.log(`[SSE] New client connected (total: ${clients.size})`);
    
    // Send heartbeat every 30 seconds to keep connection alive
    const heartbeat = setInterval(() => {
        res.write(`:heartbeat ${Date.now()}\n\n`);
    }, 30000);
    
    // Clean up on client disconnect
    req.on('close', () => {
        clearInterval(heartbeat);
        clients.delete(res);
        console.log(`[SSE] Client disconnected (total: ${clients.size})`);
    });
});

// Helper function to send activity events
function sendActivity(icon, text, type = 'system', warning = false) {
    broadcast('activity', {
        icon,
        text,
        type,
        warning,
        timestamp: Date.now()
    });
}

// Helper function to send notifications
function sendNotification(title, text, type = 'info', icon = '🔵') {
    broadcast('notification', {
        title,
        text,
        type,
        icon,
        timestamp: Date.now()
    });
}

// Helper function to send resource updates
function sendResourceUpdate(cpu, memory, disk) {
    broadcast('resource-update', {
        cpu,
        memory,
        disk,
        timestamp: Date.now()
    });
}

// Example: Simulate periodic updates (for testing)
if (process.env.NODE_ENV === 'development') {
    // Send mock activity every 2 minutes
    setInterval(() => {
        if (clients.size > 0) {
            const activities = [
                { icon: '✉️', text: 'Processed new email', type: 'system' },
                { icon: '⏰', text: 'Cron job completed', type: 'cron' },
                { icon: '📊', text: 'Generated report', type: 'system' },
                { icon: '🔧', text: 'System maintenance', type: 'system' }
            ];
            
            const activity = activities[Math.floor(Math.random() * activities.length)];
            sendActivity(activity.icon, activity.text, activity.type);
        }
    }, 120000);
    
    // Send mock resource updates every 10 seconds
    setInterval(() => {
        if (clients.size > 0) {
            sendResourceUpdate(
                Math.floor(Math.random() * 40) + 10,  // CPU 10-50%
                Math.floor(Math.random() * 30) + 30,  // Memory 30-60%
                Math.floor(Math.random() * 20) + 60   // Disk 60-80%
            );
        }
    }, 10000);
}

// Export helpers for use in other modules
module.exports = router;
module.exports.broadcast = broadcast;
module.exports.sendActivity = sendActivity;
module.exports.sendNotification = sendNotification;
module.exports.sendResourceUpdate = sendResourceUpdate;
