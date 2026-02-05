// ============================================
// WEATHER ROUTES
// ============================================

const express = require('express');
const router = express.Router();

// Mock weather data
const weatherData = {
    current: {
        temp: 72,
        condition: 'Sunny',
        icon: '☀️',
        humidity: 45,
        windSpeed: 8,
        feelsLike: 70
    },
    location: 'Minnetonka, MN',
    forecast: [
        { day: 'Thu', temp: 70, icon: '⛅', condition: 'Partly Cloudy' },
        { day: 'Fri', temp: 68, icon: '🌧️', condition: 'Rainy' },
        { day: 'Sat', temp: 72, icon: '☀️', condition: 'Sunny' }
    ],
    lastUpdate: Date.now()
};

// GET /api/weather - Get current weather
router.get('/', (req, res) => {
    const { location } = req.query;
    
    // TODO: Replace with real weather API call
    // If location is provided, fetch weather for that location
    // For now, return mock data
    
    res.json({
        ...weatherData,
        ...(location && { location })
    });
});

// GET /api/weather/forecast - Get extended forecast
router.get('/forecast', (req, res) => {
    const { days = 7, location } = req.query;
    
    // Mock extended forecast
    const extendedForecast = [
        { day: 'Thu', temp: 70, icon: '⛅', condition: 'Partly Cloudy', high: 73, low: 62 },
        { day: 'Fri', temp: 68, icon: '🌧️', condition: 'Rainy', high: 70, low: 60 },
        { day: 'Sat', temp: 72, icon: '☀️', condition: 'Sunny', high: 75, low: 64 },
        { day: 'Sun', temp: 74, icon: '☀️', condition: 'Sunny', high: 77, low: 66 },
        { day: 'Mon', temp: 71, icon: '⛅', condition: 'Partly Cloudy', high: 73, low: 63 },
        { day: 'Tue', temp: 69, icon: '🌧️', condition: 'Rainy', high: 71, low: 61 },
        { day: 'Wed', temp: 70, icon: '⛅', condition: 'Partly Cloudy', high: 72, low: 62 }
    ];
    
    res.json({
        location: location || weatherData.location,
        forecast: extendedForecast.slice(0, parseInt(days)),
        lastUpdate: Date.now()
    });
});

// POST /api/weather/location - Update location
router.post('/location', (req, res) => {
    const { location } = req.body;
    
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }
    
    // TODO: Validate location and fetch weather
    weatherData.location = location;
    
    res.json({
        message: 'Location updated',
        location,
        weather: weatherData
    });
});

module.exports = router;
