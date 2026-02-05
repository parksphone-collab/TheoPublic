// ============================================
// SYSTEM RESOURCES ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const os = require('os');

// Cache for resource data (to avoid excessive system calls)
let resourceCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5000; // 5 seconds

function getSystemResources() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (resourceCache && (now - cacheTimestamp) < CACHE_DURATION) {
        return resourceCache;
    }
    
    // Calculate CPU usage
    const cpus = os.cpus();
    const cpuUsage = cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b);
        const idle = cpu.times.idle;
        return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;
    
    // Calculate memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = (usedMem / totalMem) * 100;
    
    // Mock disk usage (would need a proper library like 'diskusage' for real data)
    const diskUsage = Math.floor(Math.random() * 20) + 60; // 60-80%
    
    // Calculate uptime
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    resourceCache = {
        cpu: Math.round(cpuUsage),
        memory: Math.round(memUsage),
        disk: diskUsage,
        uptime: `${days}d ${hours}h ${minutes}m`,
        uptimeSeconds: uptime,
        loadAvg: os.loadavg().map(avg => avg.toFixed(2)),
        totalMemory: totalMem,
        freeMemory: freeMem,
        usedMemory: usedMem,
        cpuCount: cpus.length,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname()
    };
    
    cacheTimestamp = now;
    return resourceCache;
}

// GET /api/resources - Get current system resources
router.get('/', (req, res) => {
    const resources = getSystemResources();
    
    res.json({
        ...resources,
        timestamp: Date.now()
    });
});

// GET /api/resources/history - Get resource history (mock)
router.get('/history', (req, res) => {
    const { hours = 24 } = req.query;
    
    // Mock historical data
    const history = [];
    const now = Date.now();
    const interval = 3600000; // 1 hour
    
    for (let i = parseInt(hours); i > 0; i--) {
        history.push({
            timestamp: now - (i * interval),
            cpu: Math.floor(Math.random() * 40) + 10,
            memory: Math.floor(Math.random() * 30) + 30,
            disk: Math.floor(Math.random() * 20) + 60
        });
    }
    
    res.json({
        history,
        interval: 'hourly',
        hours: parseInt(hours)
    });
});

// GET /api/resources/disk - Get detailed disk info
router.get('/disk', (req, res) => {
    // Mock disk information
    res.json({
        total: 500000000000, // 500 GB
        used: 325000000000,  // 325 GB
        free: 175000000000,  // 175 GB
        percentage: 65,
        partitions: [
            { mount: '/', used: 65, total: 500 },
            { mount: '/home', used: 42, total: 250 }
        ]
    });
});

// GET /api/resources/memory - Get detailed memory info
router.get('/memory', (req, res) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    res.json({
        total: totalMem,
        free: freeMem,
        used: usedMem,
        percentage: Math.round((usedMem / totalMem) * 100),
        formatted: {
            total: `${(totalMem / 1073741824).toFixed(2)} GB`,
            free: `${(freeMem / 1073741824).toFixed(2)} GB`,
            used: `${(usedMem / 1073741824).toFixed(2)} GB`
        }
    });
});

// GET /api/resources/cpu - Get detailed CPU info
router.get('/cpu', (req, res) => {
    const cpus = os.cpus();
    
    res.json({
        count: cpus.length,
        model: cpus[0].model,
        speed: cpus[0].speed,
        cores: cpus.map((cpu, i) => ({
            core: i,
            model: cpu.model,
            speed: cpu.speed,
            times: cpu.times
        })),
        loadAvg: os.loadavg()
    });
});

module.exports = router;
