const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const phonePattern = /^\+?[1-9]\d{7,14}$/;

function issueToken(user) {
  return jwt.sign({ sub: user.id, phone: user.phoneNumber }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'secure-print-local',
    audience: 'secure-print-clients',
  });
}

async function login(request, response) {
  const phoneNumber = String(request.body.phoneNumber || '').trim();
  const password = String(request.body.password || '');
  const user = await User.findOne({ phoneNumber }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).json({ message: 'Invalid credentials' });
  }
  return response.json({ token: issueToken(user) });
}

async function signup(request, response) {
  const phoneNumber = String(request.body.phoneNumber || '').trim();
  const password = String(request.body.password || '');
  if (!phonePattern.test(phoneNumber) || password.length < 10 || password.length > 128) {
    return response.status(400).json({ message: 'Use a valid phone number and a 10–128 character password' });
  }

  try {
    const user = await User.create({ phoneNumber, password: await bcrypt.hash(password, 12) });
    return response.status(201).json({ token: issueToken(user) });
  } catch (error) {
    if (error.code === 11000) return response.status(409).json({ message: 'Account already exists' });
    throw error;
  }
}

module.exports = { login, signup };
