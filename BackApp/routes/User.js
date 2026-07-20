const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, signup } = require('../controller/User');

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: true });
const asyncHandler = (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);

router.post('/login', authLimiter, asyncHandler(login));
router.post('/signup', authLimiter, asyncHandler(signup));

module.exports = router;
