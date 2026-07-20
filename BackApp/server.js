require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const userRoutes = require('./routes/User');
const documentRoutes = require('./routes/Pdf');

const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGINS'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters');
}

const app = express();
const origins = process.env.CLIENT_ORIGINS.split(',').map((value) => value.trim());

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '32kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: true }));
app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.use('/api/auth', userRoutes);
app.use('/api/documents', documentRoutes);
app.use((_request, response) => response.status(404).json({ message: 'Not found' }));
app.use((error, _request, response, _next) => {
  if (error?.code === 'LIMIT_FILE_SIZE') {
    return response.status(413).json({ message: 'PDF exceeds the configured size limit' });
  }
  return response.status(error.status || 500).json({ message: error.publicMessage || 'Request failed' });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  const port = Number(process.env.PORT || 5000);
  const host = process.env.HOST || '127.0.0.1';
  app.listen(port, host, () => console.log(`Secure Print API listening on ${host}:${port}`));
}

start().catch(() => {
  console.error('Secure Print API failed to start');
  process.exitCode = 1;
});
