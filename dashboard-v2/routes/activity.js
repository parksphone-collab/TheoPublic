// ============================================
// ACTIVITY FEED ROUTES
// ============================================

const express = require('express');
const router = express.Router();

// Mock activity data
let activities = [
    {
        id: 1,
        icon: '✉️',
        text: 'Processed email at 10:05 PM',
        timestamp: Date.now() - 120000,
        type: 'system',
        warning: false
    },
    {
        id: 2,
        icon: '⏰',
        text: 'Ran cron: Daily backup',
        timestamp: Date.now() - 900000,
        type: 'cron',
        warning: false
    },
    {
        id: 3,
        icon: '⚠️',
        text: 'Gmail token expires in 2 days',
        timestamp: Date.now() - 3600000,
        type: 'system',
        warning: true
    },
    {
        id: 4,
        icon: '🔧',
        text: 'System update completed',
        timestamp: Date.now() - 10800000,
        type: 'system',
        warning: false
    },
    {
        id: 5,
        icon: '📊',
        text: 'Generated analytics report',
        timestamp: Date.now() - 18000000,
        type: 'system',
        warning: false
    }
];

// GET /api/activity - Get all activities
router.get('/', (req, res) => {
    const { type, limit = 50 } = req.query;
    
    let filtered = activities;
    
    // Filter by type if specified
    if (type && type !== 'all') {
        filtered = activities.filter(a => a.type === type.toLowerCase());
    }
    
    // Limit results
    filtered = filtered.slice(0, parseInt(limit));
    
    res.json({
        activities: filtered,
        total: filtered.length
    });
});

// POST /api/activity - Add new activity
router.post('/', (req, res) => {
    const { icon, text, type = 'system', warning = false } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    
    const newActivity = {
        id: activities.length + 1,
        icon: icon || '📋',
        text,
        timestamp: Date.now(),
        type,
        warning
    };
    
    activities.unshift(newActivity);
    
    // Keep only last 100 activities
    if (activities.length > 100) {
        activities = activities.slice(0, 100);
    }
    
    res.status(201).json(newActivity);
});

// DELETE /api/activity/:id - Delete activity
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = activities.findIndex(a => a.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Activity not found' });
    }
    
    activities.splice(index, 1);
    res.json({ message: 'Activity deleted' });
});

// DELETE /api/activity - Clear all activities
router.delete('/', (req, res) => {
    activities = [];
    res.json({ message: 'All activities cleared' });
});

module.exports = router;
