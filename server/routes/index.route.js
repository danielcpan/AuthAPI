const express = require('express');
const authRoutes = require('./auth.route');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);

module.exports = router;
