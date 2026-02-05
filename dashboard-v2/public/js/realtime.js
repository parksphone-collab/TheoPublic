/**
 * THEO DASHBOARD v2.0 - Real-time Updates
 * WebSocket connection and event handling
 */

const Realtime = {
  ws: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectDelay: 3000,

  /**
   * Connect to WebSocket server
   */
  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.reconnectAttempts = 0;
        App.state.connected = true;
        this.updateConnectionStatus(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        App.state.connected = false;
        this.updateConnectionStatus(false);
        this.attemptReconnect();
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      this.attemptReconnect();
    }
  },

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(data) {
    console.log('📨 WebSocket message:', data);

    switch (data.type) {
      case 'connection':
        console.log('Connection confirmed:', data);
        break;

      case 'heartbeat':
        // Server heartbeat - could update uptime display
        if (App.state.data.status) {
          App.state.data.status.uptime = data.uptime;
        }
        break;

      case 'activity':
        // New activity log entry
        this.handleNewActivity(data.data);
        break;

      case 'notification':
        // New notification
        this.handleNewNotification(data.data);
        break;

      case 'status_update':
        // Status update (integrations, system, etc.)
        this.handleStatusUpdate(data.data);
        break;

      case 'echo':
        // Echo response
        console.log('Echo response:', data);
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  },

  /**
   * Handle new activity log entry
   */
  handleNewActivity(activity) {
    // Add to activity feed
    if (!App.state.data.activity) {
      App.state.data.activity = [];
    }

    App.state.data.activity.unshift(activity);

    // Keep only last 50 activities
    if (App.state.data.activity.length > 50) {
      App.state.data.activity = App.state.data.activity.slice(0, 50);
    }

    // Re-render activity feed
    Dashboard.renderActivityFeed();

    // Add visual notification (optional)
    this.flashWidget('activity-card');
  },

  /**
   * Handle new notification
   */
  handleNewNotification(notification) {
    // Add to notifications
    if (!App.state.data.notifications) {
      App.state.data.notifications = { notifications: [], unreadCount: 0 };
    }

    App.state.data.notifications.notifications.unshift(notification);
    App.state.data.notifications.unreadCount++;

    // Re-render notifications
    Dashboard.renderNotifications();

    // Flash notification widget
    this.flashWidget('notifications-card');
  },

  /**
   * Handle status update
   */
  handleStatusUpdate(statusData) {
    // Update relevant state
    if (statusData.integrations) {
      App.state.data.integrations = statusData.integrations;
      Dashboard.renderHeader();
      Dashboard.renderSecurity();
    }

    if (statusData.server) {
      App.state.data.server = statusData.server;
      Dashboard.renderResourceMonitor();
    }
  },

  /**
   * Flash a widget to indicate update
   */
  flashWidget(widgetId) {
    const widget = document.getElementById(widgetId);
    if (!widget) return;

    widget.style.borderColor = 'var(--color-info)';
    widget.style.boxShadow = '0 0 20px var(--color-info)';

    setTimeout(() => {
      widget.style.borderColor = '';
      widget.style.boxShadow = '';
    }, 500);
  },

  /**
   * Update connection status in UI
   */
  updateConnectionStatus(connected) {
    const statusElement = document.getElementById('status');
    if (!statusElement) return;

    if (connected) {
      statusElement.innerHTML = '<span class="led led-green pulse"></span> ONLINE';
    } else {
      statusElement.innerHTML = '<span class="led led-red"></span> DISCONNECTED';
    }
  },

  /**
   * Attempt to reconnect
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached. Falling back to polling.');
      this.fallbackToPolling();
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;

    console.log(`🔄 Attempting reconnect in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  },

  /**
   * Fallback to polling if WebSocket fails
   */
  fallbackToPolling() {
    console.log('🔄 Falling back to polling mode');

    // Poll every 10 seconds
    setInterval(async () => {
      try {
        // Fetch activity updates
        const activityRes = await fetch('/api/memory/activity');
        const activityData = await activityRes.json();

        // Check if there are new activities
        if (activityData && activityData.length > 0) {
          const latestActivity = activityData[0];
          const currentLatest = App.state.data.activity?.[0];

          if (!currentLatest || latestActivity.id !== currentLatest.id) {
            App.state.data.activity = activityData;
            Dashboard.renderActivityFeed();
          }
        }

        // Fetch notification updates
        const notifRes = await fetch('/api/notifications');
        const notifData = await notifRes.json();

        if (notifData && notifData.unreadCount !== App.state.data.notifications?.unreadCount) {
          App.state.data.notifications = notifData;
          Dashboard.renderNotifications();
        }

      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000);
  },

  /**
   * Send message via WebSocket
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    } else {
      console.warn('WebSocket not connected. Message not sent.');
      return false;
    }
  },

  /**
   * Close WebSocket connection
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  Realtime.disconnect();
});
