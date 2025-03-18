//backend/routes/fieldRoutes.js
const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fieldController");


router.post("/", fieldController.addField);
router.get("/:form_id", fieldController.getFieldsByForm);

module.exports = router;
