// src/models/taskModel.js
// Database queries only. No req, no res, no HTTP status codes.

const pool = require('../db');

const taskModel = {
  // Get every task, newest first.
  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    return rows;
  },

  // Get one task by its id.
  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Add a new task.
  create: async ({ title, completed = false }) => {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, completed) VALUES (?, ?)',
      [title, completed]
    );
    return taskModel.findById(result.insertId);
  },

  // Replace a task's title and completed.
  update: async (id, { title, completed }) => {
    const [result] = await pool.query(
      'UPDATE tasks SET title = ?, completed = ? WHERE id = ?',
      [title, completed, id]
    );
    if (result.affectedRows === 0) return null;
    return taskModel.findById(id);
  },

  // Change only the fields we were given.
  partialUpdate: async (id, fields) => {
    const updates = [];
    const values = [];

    if (fields.title !== undefined) {
      updates.push('title = ?');
      values.push(fields.title);
    }
    if (fields.completed !== undefined) {
      updates.push('completed = ?');
      values.push(fields.completed);
    }

    if (updates.length === 0) return taskModel.findById(id);

    values.push(id);

    const [result] = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;
    return taskModel.findById(id);
  },

  // Delete a task. Returns true if one was deleted.
  remove: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = taskModel;