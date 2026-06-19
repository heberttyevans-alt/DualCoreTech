const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { titulo: 'Home' });
});

router.get('/home', (req, res) => {
  res.render('index', { titulo: 'Home' });
});

module.exports = router;
