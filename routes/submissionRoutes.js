//backend/routes/submissionRoutes.js
const express = require('express');
const { submitResponse, getFormSubmissions, getFieldSubmissions} = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, submitResponse);
router.get('/:formId', authMiddleware, getFormSubmissions);
router.get('/:formId/field/', authMiddleware, getFieldSubmissions);

module.exports = router;
