//backend/routes/formRoutes.js
const express = require('express');
const { createForm, getForms, updateForm, deleteForm, getFormSchema, getFormById} = require('../controllers/formController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createForm);
router.get('/:projectId', authMiddleware, getForms);
// router.put('/forms/:id', authMiddleware, updateForm);
// router.delete('/forms/:id', authMiddleware, deleteForm);
router.get('/:id/schema', authMiddleware, getFormSchema);
router.get('/:id', authMiddleware, getFormById);

module.exports = router;

