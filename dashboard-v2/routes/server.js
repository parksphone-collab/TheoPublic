const express = require('express');
const router = express.Router();
const os = require('os');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// GET /api/server - System stats
router.get('/', async (req, res) => {
  try {
    const stats = {
      uptime: formatUptime(os.uptime()),
      uptimeSeconds: os.uptime(),
      memory: getMemoryStats(),
      cpu: await getCPUStats(),
      disk: await getDiskStats(),
      platform: os.platform(),
      hostname: os.hostname(),
      timestamp: Date.now()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching server stats:', error);
    res.status(500).json({ error: 'Failed to fetch server stats' });
  }
});

function getMemoryStats() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    total: Math.round(totalMem / 1024 / 1024 / 1024 * 10) / 10, // GB
    used: Math.round(usedMem / 1024 / 1024 / 1024 * 10) / 10,
    free: Math.round(freeMem / 1024 / 1024 / 1024 * 10) / 10,
    percentage: Math.round((usedMem / totalMem) * 100)
  };
}

async function getCPUStats() {
  const cpus = os.cpus();
  const loadAvg = os.loadavg();
  
  // Calculate CPU usage
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  
  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - Math.round(100 * idle / total);
  
  return {
    cores: cpus.length,
    model: cpus[0].model,
    usage: usage,
    loadAvg: loadAvg.map(l => Math.round(l * 100) / 100)
  };
}

async function getDiskStats() {
  try {
    // Try to get disk usage (works on Linux/Unix)
    const { stdout } = await execPromise('df -k / | tail -1');
    const parts = stdout.trim().split(/\s+/);
    
    if (parts.length >= 5) {
      const total = parseInt(parts[1]) * 1024; // Convert from KB to bytes
      const used = parseInt(parts[2]) * 1024;
      const available = parseInt(parts[3]) * 1024;
      const percentage = parseInt(parts[4]);
      
      return {
        total: Math.round(total / 1024 / 1024 / 1024 * 10) / 10, // GB
        used: Math.round(used / 1024 / 1024 / 1024 * 10) / 10,
        available: Math.round(available / 1024 / 1024 / 1024 * 10) / 10,
        percentage: percentage,
        warning: percentage > 80
      };
    }
  } catch (error) {
    // Fallback mock data if command fails (e.g., on Windows)
    return {
      total: 100,
      used: 45,
      available: 55,
      percentage: 45,
      warning: false
    };
  }
  
  return {
    total: 0,
    used: 0,
    available: 0,
    percentage: 0,
    warning: false
  };
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

module.exports = router;
