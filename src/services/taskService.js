const createError = require('http-errors');
const { query } = require('../db');

const allowedStatuses = ['pending', 'in-progress', 'completed'];

function toTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function createTask(userId, { title, description, status = 'pending' }) {
  const result = await query(
    'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
    [userId, title, description || null, status]
  );
  return getTaskById(userId, result.insertId);
}

async function getTaskById(userId, taskId) {
  const rows = await query(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ? LIMIT 1',
    [taskId, userId]
  );
  return toTask(rows[0]);
}

async function getTasks(userId, { status, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  const filters = ['user_id = ?'];
  const params = [userId];

  if (status) {
    filters.push('status = ?');
    params.push(status);
  }

  const whereClause = filters.join(' AND ');
  const data = await query(
    `SELECT * FROM tasks WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const countRows = await query(
    `SELECT COUNT(*) AS total FROM tasks WHERE ${whereClause}`,
    params
  );
  const total = countRows[0]?.total || 0;
  return {
    data: data.map(toTask),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

async function updateTask(userId, taskId, { title, description, status }) {
  const task = await getTaskById(userId, taskId);
  if (!task) {
    throw createError(404, 'Task not found');
  }

  const updates = [];
  const values = [];

  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }
  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      throw createError(400, 'Invalid status');
    }
    updates.push('status = ?');
    values.push(status);
  }

  if (updates.length === 0) {
    return task;
  }

  values.push(userId, taskId);
  await query(
    `UPDATE tasks SET ${updates.join(', ')} WHERE user_id = ? AND id = ?`,
    values
  );

  return getTaskById(userId, taskId);
}

async function deleteTask(userId, taskId) {
  const result = await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
    taskId,
    userId,
  ]);
  if (result.affectedRows === 0) {
    throw createError(404, 'Task not found');
  }
  return true;
}

module.exports = {
  allowedStatuses,
  toTask,
  createTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask,
};
