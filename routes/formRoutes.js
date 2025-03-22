//backend/routes/formRoutes.js
const express = require('express');
const { createForm, getFormsByProject, getForms, updateForm, deleteForm } = require('../controllers/formController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/forms', authMiddleware, createForm);
router.get('/forms', authMiddleware, getForms);
router.put('/forms/:id', authMiddleware, updateForm);
router.delete('/forms/:id', authMiddleware, deleteForm);

module.exports = router;
