//backend/routes/fieldRoutes.js
const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fieldController");

// Add this before your routes
router.use(express.json());

router.post("/", fieldController.addField);
router.get("/:form_id", fieldController.getFieldsByForm);

// Add this after your routes
router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      error: 'Invalid JSON payload',
      details: err.message 
    });
  }
  next();
});

module.exports = router;
