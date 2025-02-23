const express = require('express');
const { createProject, getUserProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getUserProjects);

module.exports = router;
