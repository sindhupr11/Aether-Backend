const express = require('express');
const { createForm, getFormsByProject } = require('../controllers/formController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createForm);
router.get('/:project_id', authMiddleware, getFormsByProject);

module.exports = router;
