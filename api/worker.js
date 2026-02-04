// Cloudflare Worker API for TheoPublic Dashboard
// D1 Database integration for task persistence

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers for GitHub Pages
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // GET /api/tasks - List all tasks grouped by category
      if (path === '/api/tasks' && method === 'GET') {
        const tasks = await env.DB.prepare(
          'SELECT * FROM tasks ORDER BY category, updated_at DESC'
        ).all();

        // Group by category
        const grouped = {
          fixes: [],
          investigations: [],
          money_projects: [],
          fun_projects: []
        };

        for (const task of tasks.results || []) {
          // Parse JSON fields
          if (task.links) task.links = JSON.parse(task.links);
          if (task.milestones) task.milestones = JSON.parse(task.milestones);
          
          if (grouped[task.category]) {
            grouped[task.category].push(task);
          }
        }

        return new Response(JSON.stringify(grouped), { headers: corsHeaders });
      }

      // POST /api/tasks - Create new task
      if (path === '/api/tasks' && method === 'POST') {
        const body = await request.json();
        
        const { category, title, description, priority, status, progress, 
                revenue, emoji, links, milestones, notes } = body;

        const result = await env.DB.prepare(`
          INSERT INTO tasks (category, title, description, priority, status, 
                           progress, revenue, emoji, links, milestones, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          category, title, description || null, priority || null, 
          status || 'pending', progress || 0, revenue || 0, emoji || null,
          links ? JSON.stringify(links) : '[]',
          milestones ? JSON.stringify(milestones) : '[]',
          notes || null
        ).run();

        return new Response(JSON.stringify({ 
          success: true, 
          id: result.meta?.last_row_id 
        }), { headers: corsHeaders });
      }

      // PUT /api/tasks/:id - Update task
      const updateMatch = path.match(/^\/api\/tasks\/(\d+)$/);
      if (updateMatch && method === 'PUT') {
        const id = updateMatch[1];
        const body = await request.json();
        
        const updates = [];
        const values = [];
        
        if (body.title !== undefined) { updates.push('title = ?'); values.push(body.title); }
        if (body.description !== undefined) { updates.push('description = ?'); values.push(body.description); }
        if (body.priority !== undefined) { updates.push('priority = ?'); values.push(body.priority); }
        if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status); }
        if (body.progress !== undefined) { updates.push('progress = ?'); values.push(body.progress); }
        if (body.revenue !== undefined) { updates.push('revenue = ?'); values.push(body.revenue); }
        if (body.emoji !== undefined) { updates.push('emoji = ?'); values.push(body.emoji); }
        if (body.links !== undefined) { updates.push('links = ?'); values.push(JSON.stringify(body.links)); }
        if (body.milestones !== undefined) { updates.push('milestones = ?'); values.push(JSON.stringify(body.milestones)); }
        if (body.notes !== undefined) { updates.push('notes = ?'); values.push(body.notes); }
        if (body.checked !== undefined) { updates.push('checked = ?'); values.push(body.checked ? 1 : 0); }
        
        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        await env.DB.prepare(
          `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // DELETE /api/tasks/:id - Delete task
      const deleteMatch = path.match(/^\/api\/tasks\/(\d+)$/);
      if (deleteMatch && method === 'DELETE') {
        const id = deleteMatch[1];
        
        await env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
        
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 404 for unknown routes
      return new Response(JSON.stringify({ error: 'Not found' }), { 
        status: 404, 
        headers: corsHeaders 
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};
