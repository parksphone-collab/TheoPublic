/**
 * THEO DASHBOARD v2.0 - Widget Rendering
 * All widget render functions
 */

const Dashboard = {
  /**
   * Render all widgets
   */
  renderAll() {
    this.renderHeader();
    this.renderActivityFeed();
    this.renderCalendar();
    this.renderTodoList();
    this.renderGoals();
    this.renderResourceMonitor();
    this.renderWeather();
    this.renderNotifications();
    this.renderMetrics();
    this.renderSecurity();
    this.renderChat();
  },

  /**
   * Render header bar with status and LEDs
   */
  renderHeader() {
    const integrations = App.state.data.integrations;
    if (!integrations) return;

    // Update model LEDs
    const updateLED = (id, status) => {
      const led = document.getElementById(id);
      if (led) {
        led.className = 'led';
        if (status === 'available') led.classList.add('led-green');
        else if (status === 'limited') led.classList.add('led-yellow');
        else led.classList.add('led-red');
      }
    };

    if (integrations.models) {
      updateLED('led-kimi', integrations.models.kimi?.status);
      updateLED('led-grok', integrations.models.grok?.status);
      updateLED('led-gpt', integrations.models.gpt?.status);
    }

    // Update integration LEDs
    const updateIntegrationLED = (id, led) => {
      const element = document.getElementById(id);
      if (element) {
        element.className = 'led pulse';
        if (led === 'green') element.classList.add('led-green');
        else if (led === 'yellow') element.classList.add('led-yellow');
        else element.classList.add('led-red');
      }
    };

    updateIntegrationLED('led-gmail', integrations.gmail?.led);
    updateIntegrationLED('led-discord', integrations.discord?.led);
    updateIntegrationLED('led-calendar', integrations.calendar?.led);
    updateIntegrationLED('led-ssh', integrations.ssh?.led);
  },

  /**
   * Render activity feed
   */
  renderActivityFeed() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    const activities = App.state.data.activity || [];
    const filter = App.state.filters.activity;

    // Filter activities
    const filtered = filter === 'all' 
      ? activities 
      : activities.filter(a => a.type === filter);

    container.innerHTML = filtered.map(activity => `
      <div class="activity-item ${activity.level}">
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-message">${App.escapeHtml(activity.message)}</div>
        <div class="activity-time">${App.formatRelativeTime(activity.timestamp)}</div>
      </div>
    `).join('');
  },

  /**
   * Render calendar events
   */
  renderCalendar() {
    const container = document.getElementById('calendar-events');
    const syncElement = document.getElementById('calendar-sync');
    
    if (!container) return;

    const calendar = App.state.data.calendar;
    if (!calendar || !calendar.events) {
      container.innerHTML = '<p style="color: var(--color-text-dim);">No upcoming events</p>';
      return;
    }

    // Update sync time
    if (syncElement && calendar.synced) {
      syncElement.textContent = `Synced: ${App.formatRelativeTime(calendar.synced)}`;
    }

    container.innerHTML = calendar.events.map(event => {
      const startTime = new Date(event.start);
      const formattedTime = startTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <div class="event-item">
          <div class="event-time">${formattedTime}</div>
          <div class="event-title">${App.escapeHtml(event.title)}</div>
          ${event.location ? `<div class="event-location">📍 ${App.escapeHtml(event.location)}</div>` : ''}
        </div>
      `;
    }).join('');
  },

  /**
   * Render todo list
   */
  renderTodoList() {
    const container = document.getElementById('todo-list');
    const countElement = document.getElementById('todo-count');
    
    if (!container) return;

    const todos = App.state.data.todos || [];
    const incompleteTodos = todos.filter(t => !t.completed);

    // Update count
    if (countElement) {
      countElement.textContent = incompleteTodos.length;
    }

    container.innerHTML = todos.map(todo => `
      <div class="todo-item">
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
        <div class="todo-text ${todo.completed ? 'completed' : ''}">${App.escapeHtml(todo.text)}</div>
        <div class="todo-priority ${todo.priority}">${todo.priority.toUpperCase()}</div>
      </div>
    `).join('');
  },

  /**
   * Render goals tracker
   */
  renderGoals() {
    const container = document.getElementById('goals-list');
    if (!container) return;

    const goals = App.state.data.goals || [];

    container.innerHTML = goals.map(goal => {
      const daysLeft = goal.deadline 
        ? Math.ceil((goal.deadline - Date.now()) / 86400000)
        : null;

      return `
        <div class="goal-item">
          <div class="goal-name">
            <span>${App.escapeHtml(goal.name)}</span>
            <span class="goal-percentage">${goal.progress}%</span>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
          </div>
          ${daysLeft !== null ? `<div class="goal-deadline">${daysLeft} days remaining</div>` : ''}
        </div>
      `;
    }).join('');
  },

  /**
   * Render resource monitor
   */
  renderResourceMonitor() {
    const container = document.getElementById('resource-monitor');
    if (!container) return;

    const server = App.state.data.server;
    if (!server) {
      container.innerHTML = '<p style="color: var(--color-text-dim);">Loading system stats...</p>';
      return;
    }

    const getBarClass = (percentage) => {
      if (percentage >= 90) return 'critical';
      if (percentage >= 75) return 'warning';
      return '';
    };

    container.innerHTML = `
      <div class="resource-item">
        <div class="resource-label">
          <span>DISK USAGE</span>
          <span>${server.disk?.used || 0} GB / ${server.disk?.total || 0} GB</span>
        </div>
        <div class="resource-bar">
          <div class="resource-fill ${getBarClass(server.disk?.percentage || 0)}" 
               style="width: ${server.disk?.percentage || 0}%"></div>
        </div>
      </div>

      <div class="resource-item">
        <div class="resource-label">
          <span>MEMORY</span>
          <span>${server.memory?.used || 0} GB / ${server.memory?.total || 0} GB</span>
        </div>
        <div class="resource-bar">
          <div class="resource-fill ${getBarClass(server.memory?.percentage || 0)}" 
               style="width: ${server.memory?.percentage || 0}%"></div>
        </div>
      </div>

      <div class="resource-item">
        <div class="resource-label">
          <span>CPU LOAD</span>
          <span>${server.cpu?.usage || 0}%</span>
        </div>
        <div class="resource-bar">
          <div class="resource-fill ${getBarClass(server.cpu?.usage || 0)}" 
               style="width: ${server.cpu?.usage || 0}%"></div>
        </div>
      </div>

      <div class="resource-item">
        <div class="resource-label">
          <span>UPTIME</span>
          <span>${server.uptime || 'N/A'}</span>
        </div>
      </div>
    `;
  },

  /**
   * Render weather widget
   */
  renderWeather() {
    const container = document.getElementById('weather-display');
    const locationElement = document.getElementById('weather-location');
    
    if (!container) return;

    const weather = App.state.data.weather;
    if (!weather || !weather.current) {
      container.innerHTML = '<p style="color: var(--color-text-dim);">Loading weather...</p>';
      return;
    }

    // Update location
    if (locationElement) {
      locationElement.textContent = weather.location;
    }

    container.innerHTML = `
      <div class="weather-current">
        <div class="weather-icon">${weather.current.icon}</div>
        <div class="weather-temp">${weather.current.temp}°F</div>
        <div class="weather-condition">${weather.current.condition}</div>
      </div>

      <div class="weather-forecast">
        ${weather.forecast?.map(day => `
          <div class="forecast-day">
            <div class="forecast-day-name">${day.day}</div>
            <div class="forecast-icon">${day.icon}</div>
            <div class="forecast-temps">
              <span class="forecast-high">${day.high}°</span> / 
              <span class="forecast-low">${day.low}°</span>
            </div>
          </div>
        `).join('') || ''}
      </div>
    `;
  },

  /**
   * Render notifications
   */
  renderNotifications() {
    const container = document.getElementById('notifications-list');
    const countElement = document.getElementById('notification-count');
    
    if (!container) return;

    const notificationsData = App.state.data.notifications;
    if (!notificationsData) return;

    const notifications = notificationsData.notifications || [];
    const unread = notifications.filter(n => !n.read);

    // Update count
    if (countElement) {
      countElement.textContent = unread.length;
      if (unread.length > 0) {
        countElement.classList.add('badge-alert');
      } else {
        countElement.classList.remove('badge-alert');
      }
    }

    container.innerHTML = notifications.slice(0, 5).map(notif => `
      <div class="notification-item ${notif.priority} ${notif.read ? 'read' : ''}">
        <div class="notification-header">
          <span class="notification-title">${App.escapeHtml(notif.title)}</span>
          <span class="notification-category">${notif.category}</span>
        </div>
        <div class="notification-message">${App.escapeHtml(notif.message)}</div>
        ${!notif.read ? `<div class="notification-dismiss" data-id="${notif.id}">Dismiss</div>` : ''}
      </div>
    `).join('');
  },

  /**
   * Render metrics dashboard
   */
  renderMetrics() {
    const container = document.getElementById('metrics-display');
    if (!container) return;

    // Mock metrics (replace with real data)
    const metrics = [
      { label: "Today's Cost", value: '$0.42' },
      { label: 'API Calls', value: '247' },
      { label: 'Avg Response', value: '1.2s' },
      { label: 'Error Rate', value: '0.3%' }
    ];

    container.innerHTML = metrics.map(metric => `
      <div class="metric-item">
        <span class="metric-label">${metric.label}</span>
        <span class="metric-value">${metric.value}</span>
      </div>
    `).join('');
  },

  /**
   * Render security overview
   */
  renderSecurity() {
    const container = document.getElementById('security-display');
    if (!container) return;

    const integrations = App.state.data.integrations;
    if (!integrations) return;

    const securityItems = [
      { name: 'Gmail API', status: integrations.gmail?.status, led: integrations.gmail?.led },
      { name: 'Discord', status: integrations.discord?.status, led: integrations.discord?.led },
      { name: 'SSH Connection', status: integrations.ssh?.status, led: integrations.ssh?.led }
    ];

    container.innerHTML = securityItems.map(item => `
      <div class="security-item">
        <span class="security-name">${item.name}</span>
        <span class="security-status">
          <span class="led led-${item.led || 'red'}"></span>
          ${item.status || 'Unknown'}
        </span>
      </div>
    `).join('');
  },

  /**
   * Render chat interface (initial state)
   */
  renderChat() {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    // Add welcome message
    container.innerHTML = `
      <div class="chat-message">
        <div class="chat-message-author">THEO</div>
        <div class="chat-message-text">Command interface ready. Type /help for available commands.</div>
      </div>
    `;
  }
};
