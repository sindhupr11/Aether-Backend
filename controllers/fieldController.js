//backend/controllers/fieldController.js
const db = require("../models"); 

const addField = async (req, res) => {
    try {
        const { label, type, required, form_id, is_primary_key, order } = req.body;

        const form = await db.Form.findByPk(form_id);
        if (!form) {
            return res.status(404).json({ error: "Form not found" });
        }

        // Check if trying to add a primary key
        if (is_primary_key) {
            // Check if form already has a primary key
            const existingPrimaryKey = await db.Field.findOne({
                where: { form_id, is_primary_key: true }
            });
            
            if (existingPrimaryKey) {
                return res.status(400).json({ 
                    error: "Form already has a primary key field" 
                });
            }
        }

        // If order is not provided, place at the end
        if (!order) {
            const lastField = await db.Field.findOne({
                where: { form_id },
                order: [['order', 'DESC']]
            });
            order = lastField ? lastField.order + 1 : 1;
        } else {
            // If order is provided, shift existing fields
            await db.Field.increment('order', {
                where: {
                    form_id,
                    order: { [db.Sequelize.Op.gte]: order }
                }
            });
        }

        const newField = await db.Field.create({
            label,
            type,
            required,
            form_id,
            is_primary_key,
            order
        });

        res.status(201).json({ 
            message: "Field added successfully", 
            field: newField 
        });
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
