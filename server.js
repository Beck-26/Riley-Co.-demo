require('dotenv').config();

const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || 'change-this-pin';
const DATA_DIR = path.join(__dirname, 'data');
const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureFile(filePath, fallback) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
}

function readJson(filePath, fallback = []) {
  ensureFile(filePath, fallback);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  ensureFile(filePath, []);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function requireAdminPin(req, res, next) {
  const pin = req.headers['x-admin-pin'];
  if (!pin || pin !== ADMIN_PIN) {
    return res.status(401).json({ error: 'Admin PIN required.' });
  }
  next();
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/contact', (req, res) => {
  const { name, email, phone, service, message } = req.body || {};
  if (!name || (!email && !phone)) {
    return res.status(400).json({ error: 'Name and either email or phone are required.' });
  }

  const leads = readJson(LEADS_FILE);
  const lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: String(name).trim(),
    email: String(email || '').trim(),
    phone: String(phone || '').trim(),
    service: String(service || '').trim(),
    message: String(message || '').trim()
  };
  leads.unshift(lead);
  writeJson(LEADS_FILE, leads);
  res.status(201).json({ ok: true, lead });
});

app.get('/api/quotes', requireAdminPin, (req, res) => {
  const quotes = readJson(QUOTES_FILE);
  res.json({ quotes });
});

app.post('/api/quotes', requireAdminPin, (req, res) => {
  const quote = req.body || {};
  if (!quote.customerName || !Array.isArray(quote.items) || quote.items.length === 0) {
    return res.status(400).json({ error: 'Customer name and at least one line item are required.' });
  }

  const quotes = readJson(QUOTES_FILE);
  const now = new Date().toISOString();
  const savedQuote = {
    ...quote,
    id: quote.id || crypto.randomUUID(),
    updatedAt: now,
    createdAt: quote.createdAt || now
  };

  const existingIndex = quotes.findIndex((item) => item.id === savedQuote.id);
  if (existingIndex >= 0) quotes[existingIndex] = savedQuote;
  else quotes.unshift(savedQuote);

  writeJson(QUOTES_FILE, quotes);
  res.status(201).json({ ok: true, quote: savedQuote });
});

app.delete('/api/quotes/:id', requireAdminPin, (req, res) => {
  const quotes = readJson(QUOTES_FILE);
  const nextQuotes = quotes.filter((quote) => quote.id !== req.params.id);
  writeJson(QUOTES_FILE, nextQuotes);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Riley Facilities & Maintenance website running at http://localhost:${PORT}`);
});
