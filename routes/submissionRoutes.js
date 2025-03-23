//backend/routes/submissionRoutes.js
const express = require('express');
const { submitResponse, getFormSubmissions, getFieldSubmissions, getSubmissionIdentifiers, getSubmissionByPrimaryKey, getSubmissionById} = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, submitResponse);
router.get('/:formId', authMiddleware, getFormSubmissions);
router.get('/:formId/field/', authMiddleware, getFieldSubmissions);
router.get('/:formId/identifiers', authMiddleware, getSubmissionIdentifiers);
router.get('/:formId/pkvalue', authMiddleware, getSubmissionByPrimaryKey);
router.get('/get/:submissionId', authMiddleware, getSubmissionById);

module.exports = router;
