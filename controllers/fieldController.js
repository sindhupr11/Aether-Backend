//backend/controllers/fieldController.js
const db = require("../models"); 

const addField = async (req, res) => {
    try {
        const { label, type, required, form_id } = req.body;

        const form = await db.Form.findByPk(form_id);
        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

       
        const newField = new db.Field({
            label,
            type,
            required,
            form_id,
        });

        await newField.save();
        res.status(201).json({ message: "Field added successfully", field: newField });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFieldsByForm = async (req, res) => {
    try {
        const { form_id } = req.params;

        // Fetch fields associated with the form_id
        const fields = await db.Field.findAll({ where: { form_id } });

        if (!fields || fields.length === 0) {
            return res.status(404).json({ error: "No fields found for the given form_id." });
        }

        return res.status(200).json(fields);
    } catch (error) {
        console.error("Error fetching fields:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addField,
    getFieldsByForm,
    // Export other functions if needed
};
