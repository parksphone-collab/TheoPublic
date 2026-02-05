// ============================================
// THEO DASHBOARD v2.0 — MAIN APPLICATION
// ============================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initSparkline();
    initPerformanceChart();
    // initSSE(); // TODO: Uncomment when backend is ready
    
    console.log('🎯 THEO DASHBOARD v2.0 — INITIALIZED');
});

// ============================================
// LIVE CLOCK
// ============================================

function initClock() {
    const clockElement = document.getElementById('live-clock');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        
        clockElement.textContent = `${hours}:${minutes}:${seconds} UTC`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================
// TOKEN USAGE SPARKLINE (Canvas)
// ============================================

function initSparkline() {
    const canvas = document.getElementById('sparkline');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Mock response time data (milliseconds over last 24 hours)
    const data = [
        120, 145, 132, 156, 148, 139, 142, 167, 151, 143,
        138, 149, 155, 162, 147, 141, 136, 158, 163, 149,
        144, 152, 147, 139
    ];
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
    
    // Draw sparkline
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 4) - 2;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff41';
    ctx.stroke();
}

// ============================================
// PERFORMANCE ANALYTICS CHART (Canvas)
// ============================================

function initPerformanceChart() {
    const canvas = document.getElementById('performance-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Mock tasks per day for last 30 days
    const data = [
        42, 47, 51, 38, 45, 52, 49, 55, 48, 43,
        46, 50, 54, 47, 44, 49, 53, 46, 51, 48,
        45, 50, 52, 47, 49, 51, 46, 48, 50, 47
    ];
    
    const max = Math.max(...data);
    const barWidth = width / data.length;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
    
    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / max) * (height - 20);
        const x = index * barWidth;
        const y = height - barHeight;
        
        // Bar background
        ctx.fillStyle = '#151520';
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        
        // Bar fill with gradient
        const gradient = ctx.createLinearGradient(x, y, x, height);
        gradient.addColorStop(0, '#00ff41');
        gradient.addColorStop(1, '#00aa2a');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        
        // Bar glow
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00ff41';
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        ctx.shadowBlur = 0;
    });
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

// ============================================
// SERVER-SENT EVENTS (Real-time Updates)
// ============================================

function initSSE() {
    // TODO: Replace with real API call when backend is ready
    const eventSource = new EventSource('/api/events');
    
    eventSource.addEventListener('activity', (event) => {
        const data = JSON.parse(event.data);
        addActivityItem(data);
    });
    
    eventSource.addEventListener('notification', (event) => {
        const data = JSON.parse(event.data);
        addNotification(data);
    });
    
    eventSource.addEventListener('resource-update', (event) => {
        const data = JSON.parse(event.data);
        updateResources(data);
    });
    
    eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource.close();
        
        // Retry connection after 5 seconds
        setTimeout(() => {
            initSSE();
        }, 5000);
    };
}

// ============================================
// ACTIVITY FEED HELPERS
// ============================================

function addActivityItem(data) {
    // TODO: Replace with real API call
    const feedContainer = document.querySelector('#activity-feed .card-body');
    if (!feedContainer) return;
    
    const item = document.createElement('div');
    item.className = `activity-item ${data.warning ? 'activity-warning' : ''}`;
    item.innerHTML = `
        <span class="activity-icon">${data.icon}</span>
        <span class="activity-text">${data.text}</span>
        <span class="activity-time">just now</span>
    `;
    
    feedContainer.insertBefore(item, feedContainer.firstChild);
    
    // Remove oldest item if more than 10
    const items = feedContainer.querySelectorAll('.activity-item');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
}

// ============================================
// NOTIFICATION HELPERS
// ============================================

function addNotification(data) {
    // TODO: Replace with real API call
    const notifContainer = document.querySelector('#notifications .card-body');
    if (!notifContainer) return;
    
    const item = document.createElement('div');
    item.className = `notification-item notification-${data.type}`;
    item.innerHTML = `
        <span class="notification-icon">${data.icon}</span>
        <div class="notification-content">
            <div class="notification-title">${data.title}</div>
            <div class="notification-text">${data.text}</div>
        </div>
        <button class="btn-dismiss" onclick="this.parentElement.remove()">×</button>
    `;
    
    notifContainer.insertBefore(item, notifContainer.firstChild);
    
    // Update badge count
    const badge = document.querySelector('#notifications .badge');
    if (badge) {
        const count = notifContainer.querySelectorAll('.notification-item').length;
        badge.textContent = count;
    }
}

// ============================================
// RESOURCE MONITOR HELPERS
// ============================================

function updateResources(data) {
    // TODO: Replace with real API call
    
    // Update disk
    const diskBar = document.querySelector('#resources .resource-item:nth-child(1) .progress-fill');
    const diskValue = document.querySelector('#resources .resource-item:nth-child(1) .resource-value');
    if (diskBar && diskValue) {
        diskBar.style.width = `${data.disk}%`;
        diskValue.textContent = `${data.disk}%`;
    }
    
    // Update memory
    const memBar = document.querySelector('#resources .resource-item:nth-child(2) .progress-fill');
    const memValue = document.querySelector('#resources .resource-item:nth-child(2) .resource-value');
    if (memBar && memValue) {
        memBar.style.width = `${data.memory}%`;
        memValue.textContent = `${data.memory}%`;
    }
    
    // Update CPU
    const cpuBar = document.querySelector('#resources .resource-item:nth-child(3) .progress-fill');
    const cpuValue = document.querySelector('#resources .resource-item:nth-child(3) .resource-value');
    if (cpuBar && cpuValue) {
        cpuBar.style.width = `${data.cpu}%`;
        cpuValue.textContent = `${data.cpu}%`;
    }
}

// ============================================
// BUTTON EVENT LISTENERS
// ============================================

// Filter buttons in Activity Feed
document.querySelectorAll('.btn-filter').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // TODO: Filter activity feed based on selected type
        console.log('Filter:', this.textContent);
    });
});

// Dismiss notification buttons
document.querySelectorAll('.btn-dismiss').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.remove();
        
        // Update badge count
        const notifContainer = document.querySelector('#notifications .card-body');
        const badge = document.querySelector('#notifications .badge');
        if (notifContainer && badge) {
            const count = notifContainer.querySelectorAll('.notification-item').length;
            badge.textContent = count;
        }
    });
});

// Mark all read button
const markAllReadBtn = document.querySelector('#notifications .btn-secondary');
if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
        const notifContainer = document.querySelector('#notifications .card-body');
        if (notifContainer) {
            notifContainer.innerHTML = '';
        }
        const badge = document.querySelector('#notifications .badge');
        if (badge) {
            badge.textContent = '0';
        }
    });
}

// Quick command buttons in chat
document.querySelectorAll('.btn-command').forEach(button => {
    button.addEventListener('click', function() {
        const command = this.textContent;
        const chatInput = document.querySelector('#chat .input-field');
        if (chatInput) {
            chatInput.value = command + ' ';
            chatInput.focus();
        }
    });
});

// Theme toggle buttons
document.querySelectorAll('.btn-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const parent = this.closest('.setting-toggle');
        parent.querySelectorAll('.btn-toggle').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // TODO: Apply theme change
        console.log('Theme:', this.textContent);
    });
});

// Install widget buttons
document.querySelectorAll('.btn-install').forEach(button => {
    button.addEventListener('click', function() {
        const widgetName = this.previousElementSibling.textContent;
        console.log('Installing widget:', widgetName);
        
        this.textContent = 'Installed';
        this.style.opacity = '0.5';
        this.disabled = true;
        
        // TODO: Actually install the widget
    });
});

// ============================================
// MOCK DATA POLLING (Until SSE is ready)
// ============================================

// Simulate real-time updates every 5 seconds
setInterval(() => {
    // Random resource updates
    const mockResources = {
        disk: Math.floor(Math.random() * 20) + 60,  // 60-80%
        memory: Math.floor(Math.random() * 30) + 30, // 30-60%
        cpu: Math.floor(Math.random() * 40) + 10     // 10-50%
    };
    
    updateResources(mockResources);
    
    // Update "Updated: just now" timestamp
    const resourceTimestamp = document.querySelector('#resources .sync-status');
    if (resourceTimestamp) {
        resourceTimestamp.textContent = 'Updated: just now';
    }
}, 5000);

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log(`
╔═══════════════════════════════════════════╗
║   THEO DASHBOARD v2.0 — MISSION CONTROL   ║
║                                           ║
║   Status: OPERATIONAL                     ║
║   Security: ENCRYPTED                     ║
║   Build: 2026.02.05                       ║
║                                           ║
║   "Excellence is not an act, but a habit" ║
╚═══════════════════════════════════════════╝
`);
