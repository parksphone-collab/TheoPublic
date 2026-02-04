# TheoPublic Backend API

Cloudflare Worker + D1 Database for task persistence.

## Setup

### 1. Install Wrangler
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Create D1 Database
```bash
wrangler d1 create theopublic-tasks
```

**Copy the database ID** from output — you'll need it for `wrangler.toml`.

### 4. Update wrangler.toml
Edit `wrangler.toml` and paste your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "theopublic-tasks"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 5. Initialize Database Schema
```bash
wrangler d1 execute theopublic-tasks --file=./api/schema.sql
```

### 6. Deploy Worker
```bash
wrangler deploy
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks (grouped by category) |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Testing

### List tasks
```bash
curl https://your-worker.your-subdomain.workers.dev/api/tasks
```

### Create task
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "category": "fixes",
    "title": "Test task",
    "priority": "high",
    "status": "pending"
  }'
```

### Update task
```bash
curl -X PUT https://your-worker.your-subdomain.workers.dev/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed", "checked": true}'
```

### Delete task
```bash
curl -X DELETE https://your-worker.your-subdomain.workers.dev/api/tasks/1
```

## Frontend Integration

Update `widgets/project-tracker.js` to use real API:

```javascript
// Change API_URL to your worker URL
const API_URL = 'https://your-worker.your-subdomain.workers.dev/api/tasks';
```

## Free Tier Limits

- **D1:** 5M rows/day, 500K queries/day
- **Workers:** 100,000 requests/day

More than enough for personal use.
