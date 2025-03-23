const express = require('express');
const { getGrokResponse } = require('../controllers/llmController');

const router = express.Router();

router.post('/grok', getGrokResponse);

module.exports = router;
