// src/controllers/taskController.js
// Validates input, calls the model, sends the HTTP response. No SQL here.

const taskModel = require('../models/taskModel');

const taskController = {
  // GET /tasks - send back every task.
  getAllTasks: async (req, res, next) => {
    try {
      const tasks = await taskModel.findAll();
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  // GET /tasks/:id - send back one task.
  getTaskById: async (req, res, next) => {
    try {
      const task = await taskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  // POST /tasks - save a new task.
  createTask: async (req, res, next) => {
    try {
      const { title, completed } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const newTask = await taskModel.create({
        title: title.trim(),
        completed: completed ?? false,
      });

      res.status(201).json(newTask);
    } catch (err) {
      next(err);
    }
  },

  // PUT /tasks/:id - replace the whole task.
  updateTask: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'completed must be true or false' });
      }

      const updatedTask = await taskModel.update(id, {
        title: title.trim(),
        completed,
      });

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /tasks/:id - change only some parts.
  patchTask: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;

      if (title === undefined && completed === undefined) {
        return res.status(400).json({
          error: 'Provide title or completed to update',
        });
      }
      if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'completed must be true or false' });
      }

      const fields = {};
      if (title !== undefined) fields.title = title.trim();
      if (completed !== undefined) fields.completed = completed;

      const updatedTask = await taskModel.partialUpdate(id, fields);

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /tasks/:id - remove a task.
  deleteTask: async (req, res, next) => {
    try {
      const deleted = await taskModel.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = taskController;