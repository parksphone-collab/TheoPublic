const express = require('express');
const router = express.Router();
const parser = require('../utils/parser');

// GET /api/memory/todos - Get todos from memory
router.get('/todos', async (req, res) => {
  try {
    // Mock todos (replace with real parser)
    const todos = [
      {
        id: 1,
        text: 'Deploy dashboard to production',
        priority: 'high',
        completed: false,
        dueDate: Date.now() + 86400000 // Tomorrow
      },
      {
        id: 2,
        text: 'Update API documentation',
        priority: 'medium',
        completed: false,
        dueDate: Date.now() + 172800000 // 2 days
      },
      {
        id: 3,
        text: 'Review security audit findings',
        priority: 'high',
        completed: false,
        dueDate: Date.now() + 43200000 // 12 hours
      },
      {
        id: 4,
        text: 'Optimize database queries',
        priority: 'low',
        completed: true,
        dueDate: null
      },
      {
        id: 5,
        text: 'Set up monitoring alerts',
        priority: 'medium',
        completed: false,
        dueDate: Date.now() + 259200000 // 3 days
      }
    ];
    
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET /api/memory/goals - Get active goals
router.get('/goals', async (req, res) => {
  try {
    const goals = [
      {
        id: 1,
        name: 'Complete dashboard v2',
        progress: 75,
        deadline: Date.now() + 259200000, // 3 days
        status: 'in-progress'
      },
      {
        id: 2,
        name: 'Reach 100 API integrations',
        progress: 60,
        deadline: Date.now() + 2592000000, // 30 days
        status: 'in-progress'
      },
      {
        id: 3,
        name: 'Automate daily reports',
        progress: 90,
        deadline: Date.now() + 86400000, // 1 day
        status: 'near-complete'
      },
      {
        id: 4,
        name: 'Improve response time by 20%',
        progress: 45,
        deadline: Date.now() + 1209600000, // 14 days
        status: 'in-progress'
      }
    ];
    
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// GET /api/memory/activity - Recent activity log
router.get('/activity', async (req, res) => {
  try {
    const activities = [
      {
        id: 1,
        icon: '✉️',
        message: 'Processed 12 emails from inbox',
        type: 'email',
        timestamp: Date.now() - 300000, // 5 min ago
        level: 'success'
      },
      {
        id: 2,
        icon: '⏰',
        message: 'Ran cron: Daily backup completed',
        type: 'cron',
        timestamp: Date.now() - 600000, // 10 min ago
        level: 'success'
      },
      {
        id: 3,
        icon: '🔄',
        message: 'Synced calendar events (5 new)',
        type: 'system',
        timestamp: Date.now() - 900000, // 15 min ago
        level: 'info'
      },
      {
        id: 4,
        icon: '⚠️',
        message: 'API rate limit warning: OpenAI',
        type: 'system',
        timestamp: Date.now() - 1200000, // 20 min ago
        level: 'warning'
      },
      {
        id: 5,
        icon: '📊',
        message: 'Generated analytics report',
        type: 'system',
        timestamp: Date.now() - 1800000, // 30 min ago
        level: 'success'
      },
      {
        id: 6,
        icon: '🔐',
        message: 'SSH connection established',
        type: 'system',
        timestamp: Date.now() - 2400000, // 40 min ago
        level: 'success'
      },
      {
        id: 7,
        icon: '❌',
        message: 'Failed to fetch weather data (retrying)',
        type: 'error',
        timestamp: Date.now() - 3000000, // 50 min ago
        level: 'error'
      },
      {
        id: 8,
        icon: '✅',
        message: 'Deployment verification passed',
        type: 'system',
        timestamp: Date.now() - 3600000, // 1 hour ago
        level: 'success'
      }
    ];
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

module.exports = router;
