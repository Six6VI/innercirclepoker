const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = Number(process.env.PORT || 8080);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'innercircle.db');
const SESSION_SECRET = process.env.SESSION_SECRET || 'innercircle-local-dev-secret';

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map((header) => header.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = lines[i].split(',').map((value) => value.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    rows.push(row);
  }

  return rows;
}

function toInt(value) {
  const parsed = parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toPublicUser(userRow) {
  return {
    id: userRow.id,
    username: userRow.username,
    name: userRow.name,
    role: userRow.role
  };
}

async function seedUsersIfNeeded() {
  const countRow = await get('SELECT COUNT(*) AS count FROM users');
  if (countRow?.count > 0) {
    return;
  }

  const usersCsvPath = path.join(__dirname, 'users.csv');
  if (!fs.existsSync(usersCsvPath)) {
    return;
  }

  const usersText = fs.readFileSync(usersCsvPath, 'utf8');
  const users = parseCsv(usersText);

  for (const user of users) {
    const role = user.username === 'jhogle' ? 'admin' : 'member';
    await run(
      `INSERT INTO users (key_id, username, password, name, email, phone, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(user.keyID || 0),
        user.username,
        user.password,
        user.name,
        user.email || '',
        user.phone || '',
        role
      ]
    );
  }
}

async function seedStandingsIfNeeded() {
  const countRow = await get('SELECT COUNT(*) AS count FROM standings');
  if (countRow?.count > 0) {
    return;
  }

  const standingsCsvPath = path.join(__dirname, 'standings.csv');
  if (!fs.existsSync(standingsCsvPath)) {
    return;
  }

  const standingsText = fs.readFileSync(standingsCsvPath, 'utf8');
  const standings = parseCsv(standingsText);

  for (const entry of standings) {
    await run(
      'INSERT INTO standings (name, last_rank, points) VALUES (?, ?, ?)',
      [entry.Name, entry.LastRank, Number(entry.Points || 0)]
    );
  }
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_id INTEGER,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'member',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      last_rank TEXT NOT NULL,
      points REAL NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await seedUsersIfNeeded();
  await seedStandingsIfNeeded();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.session.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required.' });
    return;
  }
  next();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: 'innercircle.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required.' });
    return;
  }

  const user = await get(
    'SELECT id, username, password, name, role FROM users WHERE username = ?',
    [username]
  );

  if (!user || user.password !== password) {
    res.status(401).json({ message: 'Invalid username or password.' });
    return;
  }

  req.session.user = toPublicUser(user);
  res.json({ user: req.session.user });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('innercircle.sid');
    res.json({ ok: true });
  });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

app.post('/api/change-password', requireAuth, async (req, res) => {
  const currentPassword = String(req.body.currentPassword || '');
  const newPassword = String(req.body.newPassword || '');

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'Current and new password are required.' });
    return;
  }

  if (newPassword.length < 4) {
    res.status(400).json({ message: 'New password must be at least 4 characters.' });
    return;
  }

  const user = await get('SELECT id, password FROM users WHERE id = ?', [req.session.user.id]);

  if (!user || user.password !== currentPassword) {
    res.status(400).json({ message: 'Current password is incorrect.' });
    return;
  }

  await run('UPDATE users SET password = ? WHERE id = ?', [newPassword, user.id]);
  res.json({ ok: true });
});

app.get('/api/standings', requireAuth, async (_req, res) => {
  const standingsRows = await all(
    'SELECT name, last_rank AS lastRank, points FROM standings ORDER BY points DESC, name ASC'
  );

  const standings = standingsRows.map((row, index) => ({
    name: row.name,
    lastRank: row.lastRank,
    lastRankNumber: toInt(row.lastRank),
    points: Number(row.points),
    rank: index + 1
  }));

  res.json({ standings });
});

app.post('/api/standings', requireAuth, requireAdmin, async (req, res) => {
  const incomingStandings = Array.isArray(req.body.standings) ? req.body.standings : null;

  if (!incomingStandings || incomingStandings.length === 0) {
    res.status(400).json({ message: 'A non-empty standings array is required.' });
    return;
  }

  await run('BEGIN TRANSACTION');

  try {
    await run('DELETE FROM standings');

    for (const item of incomingStandings) {
      const name = String(item.name || '').trim();
      const lastRank = String(item.lastRank || '').trim();
      const points = Number(item.points);

      if (!name || !lastRank || Number.isNaN(points)) {
        throw new Error('Each standings record must include name, lastRank, and numeric points.');
      }

      await run(
        'INSERT INTO standings (name, last_rank, points, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
        [name, lastRank, points]
      );
    }

    await run('COMMIT');
    res.json({ ok: true, count: incomingStandings.length });
  } catch (error) {
    await run('ROLLBACK');
    res.status(400).json({ message: error.message || 'Could not update standings.' });
  }
});

app.get('/users.csv', (_req, res) => {
  res.status(403).send('Direct file access disabled.');
});

app.get('/standings.csv', (_req, res) => {
  res.status(403).send('Direct file access disabled.');
});

app.use('/node_modules', (_req, res) => {
  res.status(403).send('Not allowed.');
});

app.use(express.static(__dirname, { extensions: ['html'] }));

app.use((err, _req, res, next) => {
  if (err && err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON body.' });
    return;
  }
  next(err);
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Inner Circle Poker app running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize database.', error);
    process.exit(1);
  });
