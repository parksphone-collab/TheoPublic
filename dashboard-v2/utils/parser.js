const fs = require('fs');
const path = require('path');

/**
 * Memory file parser - extracts structured data from markdown files
 * Uses whitelist approach to avoid leaking sensitive information
 */

class MemoryParser {
  /**
   * Parse markdown file for todos
   * Looks for patterns like: - [ ] Task name (priority: high) @due:2024-01-15
   */
  static parseTodos(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const todos = [];
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Match checkbox todos
        const todoMatch = line.match(/^-\s*\[([ x])\]\s*(.+)/i);
        if (todoMatch) {
          const completed = todoMatch[1].toLowerCase() === 'x';
          let text = todoMatch[2].trim();
          
          // Extract priority
          const priorityMatch = text.match(/\(priority:\s*(high|medium|low)\)/i);
          const priority = priorityMatch ? priorityMatch[1].toLowerCase() : 'medium';
          
          // Extract due date
          const dueDateMatch = text.match(/@due:(\d{4}-\d{2}-\d{2})/);
          const dueDate = dueDateMatch ? new Date(dueDateMatch[1]).getTime() : null;
          
          // Clean up text
          text = text
            .replace(/\(priority:\s*(high|medium|low)\)/i, '')
            .replace(/@due:\d{4}-\d{2}-\d{2}/, '')
            .trim();
          
          todos.push({
            id: index,
            text,
            priority,
            completed,
            dueDate
          });
        }
      });
      
      return todos;
    } catch (error) {
      console.error('Error parsing todos:', error);
      return [];
    }
  }
  
  /**
   * Parse markdown file for goals
   * Looks for patterns like: ## Goal: Name (progress: 75%) @deadline:2024-01-20
   */
  static parseGoals(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const goals = [];
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const goalMatch = line.match(/##\s*Goal:\s*(.+)/i);
        if (goalMatch) {
          let text = goalMatch[1].trim();
          
          // Extract progress
          const progressMatch = text.match(/\(progress:\s*(\d+)%\)/i);
          const progress = progressMatch ? parseInt(progressMatch[1]) : 0;
          
          // Extract deadline
          const deadlineMatch = text.match(/@deadline:(\d{4}-\d{2}-\d{2})/);
          const deadline = deadlineMatch ? new Date(deadlineMatch[1]).getTime() : null;
          
          // Clean up text
          text = text
            .replace(/\(progress:\s*\d+%\)/i, '')
            .replace(/@deadline:\d{4}-\d{2}-\d{2}/, '')
            .trim();
          
          goals.push({
            id: index,
            name: text,
            progress,
            deadline,
            status: progress >= 90 ? 'near-complete' : 'in-progress'
          });
        }
      });
      
      return goals;
    } catch (error) {
      console.error('Error parsing goals:', error);
      return [];
    }
  }
  
  /**
   * Sanitize data to remove sensitive information
   */
  static sanitize(data) {
    // Remove any potential API keys, tokens, or sensitive patterns
    const sensitivePatterns = [
      /api[_-]?key/i,
      /token/i,
      /password/i,
      /secret/i,
      /credential/i,
      /[a-f0-9]{32,}/i, // Long hex strings (likely tokens)
    ];
    
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Recursively check and redact
    const redact = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          sensitivePatterns.forEach(pattern => {
            if (pattern.test(key) || pattern.test(obj[key])) {
              obj[key] = '[REDACTED]';
            }
          });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          redact(obj[key]);
        }
      }
    };
    
    redact(sanitized);
    return sanitized;
  }
}

module.exports = MemoryParser;
