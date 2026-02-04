class CalendarWidget {
  constructor(container, calendarUrl = '/data/calendar.json') {
    this.container = container;
    this.calendarUrl = calendarUrl;
    this.events = [];
    this.init();
  }

  async init() {
    this.renderLoading();
    await this.loadEvents();
    this.render();
  }

  renderLoading() {
    this.container.innerHTML = `
      <div class="calendar-widget">
        <div class="calendar-header">
          <span class="calendar-title">📅 SCHEDULE</span>
          <span class="calendar-blink">_</span>
        </div>
        <div class="calendar-loading">LOADING EVENTS...</div>
      </div>
    `;
  }

  async loadEvents() {
    try {
      const response = await fetch(this.calendarUrl);
      if (response.ok) {
        this.events = await response.json();
        // Sort by date
        this.events.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
      } else {
        throw new Error('Failed to load');
      }
    } catch (e) {
      // Fallback events
      this.events = [
        {title: "Shadow Spade Poker", date: "2026-02-06", time: "19:30", calendar: "social"},
        {title: "Income Goal Deadline", date: "2026-02-09", time: "23:59", calendar: "goals"}
      ];
    }
  }

  render() {
    const calendarColors = {
      work: '#4488ff',
      personal: '#00ff88',
      social: '#ffaa00',
      goals: '#ff4444'
    };

    this.container.innerHTML = `
      <div class="calendar-widget">
        <div class="calendar-header">
          <span class="calendar-title">📅 SCHEDULE</span>
          <span class="calendar-blink">_</span>
        </div>
        <div class="calendar-list">
          ${this.events.slice(0, 7).map(e => {
            const dateObj = new Date(e.date + 'T' + e.time);
            const dateStr = dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
            const timeStr = dateObj.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
            const color = calendarColors[e.calendar] || '#888';
            return `
              <div class="calendar-event">
                <div class="event-marker" style="background:${color}"></div>
                <div class="event-info">
                  <div class="event-title">${e.title}</div>
                  <div class="event-time">${dateStr} • ${timeStr}</div>
                </div>
                <div class="event-calendar" style="color:${color}">${e.calendar}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="calendar-footer">
          <a href="https://calendar.google.com" target="_blank" class="calendar-link">Open Google Calendar →</a>
        </div>
      </div>
    `;
  }
}