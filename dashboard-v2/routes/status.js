const express = require('express');
const router = express.Router();
const os = require('os');
const fs = require('fs');
const path = require('path');

// GET /api/status - Server health check
router.get('/', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'online',
    uptime: uptime,
    uptimeFormatted: formatUptime(uptime),
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
    },
    timestamp: Date.now()
  });
});

// GET /api/status/integrations - Integration status
router.get('/integrations', (req, res) => {
  // Mock integration status (replace with real checks)
  const integrations = {
    gmail: {
      status: 'connected',
      led: 'green',
      lastCheck: Date.now() - 120000, // 2 min ago
      message: 'Connected'
    },
    discord: {
      status: 'connected',
      led: 'green',
      lastCheck: Date.now() - 60000, // 1 min ago
      message: 'Active'
    },
    calendar: {
      status: 'connected',
      led: 'green',
      lastCheck: Date.now() - 180000, // 3 min ago
      message: 'Synced'
    },
    ssh: {
      status: 'connected',
      led: 'green',
      lastCheck: Date.now() - 30000, // 30 sec ago
      message: 'Connected to pgs-ventures'
    },
    models: {
      kimi: { status: 'available', led: 'green' },
      grok: { status: 'available', led: 'green' },
      gpt: { status: 'limited', led: 'yellow' }
    }
  };
  
  res.json(integrations);
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

module.exports = router;
