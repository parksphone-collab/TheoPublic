const express = require('express');
const router = express.Router();

// In-memory notifications store (replace with database in production)
let notifications = [
  {
    id: 1,
    title: 'Deployment Ready',
    message: 'Dashboard v2 is ready for production deployment',
    category: 'system',
    priority: 'high',
    read: false,
    timestamp: Date.now() - 600000 // 10 min ago
  },
  {
    id: 2,
    title: 'Goal Progress',
    message: 'You\'re 90% complete on "Automate daily reports"',
    category: 'goals',
    priority: 'medium',
    read: false,
    timestamp: Date.now() - 1800000 // 30 min ago
  },
  {
    id: 3,
    title: 'Security Update',
    message: 'New login detected from unknown location',
    category: 'security',
    priority: 'urgent',
    read: false,
    timestamp: Date.now() - 3600000 // 1 hour ago
  },
  {
    id: 4,
    title: 'API Limit Warning',
    message: 'OpenAI API usage at 85% of daily quota',
    category: 'system',
    priority: 'medium',
    read: true,
    timestamp: Date.now() - 7200000 // 2 hours ago
  },
  {
    id: 5,
    title: 'Calendar Reminder',
    message: 'Team standup starts in 2 hours',
    category: 'updates',
    priority: 'low',
    read: false,
    timestamp: Date.now() - 900000 // 15 min ago
  }
];

// GET /api/notifications - Get all notifications
router.get('/', (req, res) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  res.json({
    notifications: notifications.sort((a, b) => b.timestamp - a.timestamp),
    unreadCount: unreadCount,
    total: notifications.length
  });
});

// POST /api/notifications/:id/dismiss - Mark notification as read
router.post('/:id/dismiss', (req, res) => {
  const id = parseInt(req.params.id);
  const notification = notifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  notification.read = true;
  
  res.json({
    success: true,
    notification: notification
  });
});

// POST /api/notifications/dismiss-all - Mark all as read
router.post('/dismiss-all', (req, res) => {
  notifications.forEach(n => n.read = true);
  
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

module.exports = router;
