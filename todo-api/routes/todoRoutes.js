const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// ดึงรายการ todos ทั้งหมด
router.get('/api/todos', async (req, res) => {
  try {
    const [todos] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving data', error: err.message });
  }
});

// เพิ่ม todo ใหม่
router.post('/api/todos', async (req, res) => {
  try {
    const { name, status } = req.body;
    if (!name || !status) {
      return res.status(400).json({ message: 'Name and status are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO todos (name, status, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [name, status]
    );

    res.status(201).json({ id: result.insertId, name, status });
  } catch (err) {
    res.status(500).json({ message: 'Error inserting data', error: err.message });
  }
});

// อัปเดต todo
router.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    if (!name && !status) {
      return res.status(400).json({ message: 'At least one field (name or status) is required' });
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }

    if (status) {
      fields.push('status = ?');
      values.push(status);
    }

    values.push(id);

    const [updateResult] = await pool.query(
      `UPDATE todos SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const [rows] = await pool.query(
      'SELECT id, name, status, updated_at FROM todos WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: ' Task not found after update' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating data', error: err.message });
  }
});

// ลบ todo
router.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: `Task ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting data', error: err.message });
  }
});

module.exports = router;