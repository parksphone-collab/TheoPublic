const express = require('express');
const router = express.Router();

// GET /api/gmail - Gmail status and recent subjects
router.get('/', async (req, res) => {
  try {
    // Mock Gmail data (replace with real Gmail API)
    const gmailData = {
      unreadCount: 7,
      lastCheck: Date.now() - 120000, // 2 min ago
      status: 'connected',
      recentSubjects: [
        {
          id: 1,
          subject: 'Re: Dashboard deployment updates',
          from: 'john@example.com',
          timestamp: Date.now() - 1800000, // 30 min ago
          unread: true
        },
        {
          id: 2,
          subject: 'Security Alert: New login detected',
          from: 'security@pgs-ventures.com',
          timestamp: Date.now() - 3600000, // 1 hour ago
          unread: true
        },
        {
          id: 3,
          subject: 'Weekly Analytics Report',
          from: 'analytics@system.local',
          timestamp: Date.now() - 7200000, // 2 hours ago
          unread: false
        }
      ]
    };
    
    res.json(gmailData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch Gmail data',
      unreadCount: 0,
      status: 'disconnected'
    });
  }
});

module.exports = router;
