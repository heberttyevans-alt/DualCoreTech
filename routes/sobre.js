const express = require('express');
const router = express.Router();

router.get('/sobre', (req, res) => {
  res.render('sobre', { titulo: 'Sobre' });
});

module.exports = router;