const express = require('express');

const authRoutes = require('./AuthRoute.js');
const router = express.Router();

router.get('/check', (req, res) =>
    res.send('OK')
);

router.use('/auth', authRoutes);
// router.use('/user', userRoutes);

module.exports = router;