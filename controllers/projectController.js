const db = require('../models');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const project = await db.Project.create({ name, description, user_id: userId });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await db.Project.findAll({ where: { user_id: userId } });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
