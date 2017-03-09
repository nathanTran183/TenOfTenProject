const express = require('express');

const authRoutes = require('./AuthRoute');
const userRoutes = require('./UserRoute');
const router = express.Router();
const path = require('path');

router.get('/check', (req, res) =>
    res.send('OK')
);
router.get('/', (req, res) => {res.sendFile(path.resolve(__dirname, '../../public/app', 'index.html'));})
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

module.exports = router;