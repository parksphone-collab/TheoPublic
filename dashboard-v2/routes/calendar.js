// ============================================
// CALENDAR ROUTES
// ============================================

const express = require('express');
const router = express.Router();

// Mock calendar events
let events = [
    {
        id: 1,
        title: 'Team Standup',
        time: '10:00 AM',
        date: new Date().toISOString().split('T')[0],
        type: 'meeting',
        participants: ['alice@example.com', 'bob@example.com']
    },
    {
        id: 2,
        title: 'Project Review',
        time: '2:00 PM',
        date: new Date().toISOString().split('T')[0],
        type: 'meeting',
        participants: ['charlie@example.com']
    },
    {
        id: 3,
        title: 'Dentist Appointment',
        time: '4:30 PM',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        type: 'personal',
        participants: []
    }
];

// GET /api/calendar - Get all events
router.get('/', (req, res) => {
    const { date, type } = req.query;
    
    let filtered = events;
    
    // Filter by date if specified
    if (date) {
        filtered = filtered.filter(e => e.date === date);
    }
    
    // Filter by type if specified
    if (type) {
        filtered = filtered.filter(e => e.type === type);
    }
    
    res.json({
        events: filtered,
        lastSync: Date.now(),
        total: filtered.length
    });
});

// GET /api/calendar/:id - Get specific event
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const event = events.find(e => e.id === parseInt(id));
    
    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
});

// POST /api/calendar - Create new event
router.post('/', (req, res) => {
    const { title, time, date, type = 'meeting', participants = [] } = req.body;
    
    if (!title || !time || !date) {
        return res.status(400).json({ 
            error: 'Title, time, and date are required' 
        });
    }
    
    const newEvent = {
        id: events.length + 1,
        title,
        time,
        date,
        type,
        participants
    };
    
    events.push(newEvent);
    
    res.status(201).json(newEvent);
});

// PUT /api/calendar/:id - Update event
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = events.findIndex(e => e.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Event not found' });
    }
    
    events[index] = {
        ...events[index],
        ...req.body,
        id: parseInt(id)
    };
    
    res.json(events[index]);
});

// DELETE /api/calendar/:id - Delete event
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = events.findIndex(e => e.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Event not found' });
    }
    
    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
});

module.exports = router;
