const API_URL = 'https://theopublic-api.thaddeus-ops.workers.dev/api/tasks';

class ProjectTracker {
  constructor(container) {
    this.container = container;
    this.tasks = null;
    this.loadTasks();
  }

  async loadTasks() {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        this.tasks = await response.json();
      } else {
        throw new Error('API error');
      }
    } catch (e) {
      // Fallback to mock data
      this.tasks = {
        fixes: [
          { id: 1, title: 'Memory search auth fix', priority: 'high', status: 'completed', checked: true },
          { id: 2, title: 'Gmail token refresh', priority: 'medium', status: 'pending', checked: false }
        ],
        investigations: [
          { id: 3, title: 'OpenRouter embeddings for memory', status: 'completed', notes: 'Working via remote config' },
          { id: 4, title: 'Cloudflare Workers for API proxy', status: 'in progress', notes: 'Exploring for financial data' }
        ],
        money_projects: [
          { id: 5, title: 'Theo Dashboard SaaS', progress: 25, revenue: 0, description: 'CIA-style dashboard for productivity', links: ['https://github.com/parksphone-collab/TheoPublic'] },
          { id: 6, title: 'AI Consulting', progress: 10, revenue: 0, description: 'Personal AI assistant services' }
        ],
        fun_projects: [
          { id: 7, title: '3D Print Tracker', emoji: '🖨️', milestones: [{ done: true, text: 'Design mockups' }, { done: false, text: 'Bambu API integration' }], notes: 'Track P2S prints and filament' }
        ]
      };
    }
    this.render();
  }

  render() {
    if (!this.tasks) {
      this.container.innerHTML = '<div class="tracker-widget"><div class="tracker-header"><span class="tracker-title">▓▓▓ MISSION LOG</span><span class="tracker-blink">_</span></div><div style="text-align:center;padding:2rem;color:#888;">LOADING...</div></div>';
      return;
    }

    const fixes = this.tasks.fixes || [];
    const investigations = this.tasks.investigations || [];
    const moneyProjects = this.tasks.money_projects || [];
    const funProjects = this.tasks.fun_projects || [];

    this.container.innerHTML = `
      <div class="tracker-widget">
        <div class="tracker-header">
          <span class="tracker-title">▓▓▓ MISSION LOG</span>
          <span class="tracker-blink">_</span>
        </div>
        
        <div class="tracker-section">
          <div class="section-header">
            <span class="section-icon">🔧</span>
            <span>FIXES NEEDED</span>
            <span class="count-badge">${fixes.length}</span>
          </div>
          <div class="task-list">
            ${fixes.map(t => this.renderFixItem(t)).join('')}
          </div>
        </div>

        <div class="tracker-section">
          <div class="section-header">
            <span class="section-icon">🔍</span>
            <span>INVESTIGATIONS</span>
            <span class="count-badge">${investigations.length}</span>
          </div>
          <div class="task-list">
            ${investigations.map(t => this.renderInvestigationItem(t)).join('')}
          </div>
        </div>

        <div class="tracker-section">
          <div class="section-header">
            <span class="section-icon">💰</span>
            <span>MONEY PROJECTS</span>
          </div>
          <div class="card-grid">
            ${moneyProjects.map(t => this.renderMoneyCard(t)).join('')}
          </div>
        </div>

        <div class="tracker-section">
          <div class="section-header">
            <span class="section-icon">🎮</span>
            <span>FUN PROJECTS</span>
          </div>
          <div class="card-grid">
            ${funProjects.map(t => this.renderFunCard(t)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderFixItem(t) {
    const priorityColor = { high: '#ff4444', medium: '#ffaa00', low: '#00ff88' }[t.priority] || '#888';
    return `
      <div class="task-item ${t.checked ? 'checked' : ''}">
        <input type="checkbox" ${t.checked ? 'checked' : ''}>
        <span class="task-title">${t.title}</span>
        <span class="priority-pill" style="background:${priorityColor}">${t.priority || 'MEDIUM'}</span>
      </div>
    `;
  }

  renderInvestigationItem(t) {
    const statusColor = { completed: '#00ff88', 'in progress': '#ffaa00', pending: '#666' }[t.status] || '#888';
    return `
      <div class="task-item">
        <span class="status-dot" style="background:${statusColor}"></span>
        <span class="task-title">${t.title}</span>
        <span class="task-status">${t.status || 'pending'}</span>
      </div>
    `;
  }

  renderMoneyCard(t) {
    const links = t.links || [];
    return `
      <div class="project-card">
        <div class="card-title">${t.title}</div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${t.progress || 0}%"></div>
          </div>
          <span class="progress-text">${t.progress || 0}%</span>
        </div>
        <div class="revenue-line">
          <span class="revenue-label">EST. REVENUE</span>
          <span class="revenue-value">$${(t.revenue || 0).toLocaleString()}</span>
        </div>
        <div class="card-details">${t.description || ''}</div>
      </div>
    `;
  }

  renderFunCard(t) {
    const milestones = t.milestones || [];
    return `
      <div class="project-card fun-card">
        <div class="card-emoji">${t.emoji || '🚀'}</div>
        <div class="card-title">${t.title}</div>
        <ul class="milestones">
          ${milestones.map(m => `
            <li class="milestone ${m.done ? 'done' : ''}">
              <span class="check">${m.done ? '✓' : '○'}</span>
              <span>${m.text}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
}