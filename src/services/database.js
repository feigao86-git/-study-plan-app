import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

let db = null;

// Initialize database
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('studyPlan.db');
    await createTables();
    await initDefaultSettings();
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Create tables
const createTables = async () => {
  if (!db) return;

  // Tasks table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      subject TEXT,
      task_type TEXT,
      planned_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      reminder_time TEXT,
      incomplete_reason TEXT,
      incomplete_description TEXT,
      incomplete_photos TEXT,
      voice_note TEXT,
      rolled_from TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT
    );
  `);

  // Task roll history
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS task_roll_history (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL,
      reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id)
    );
  `);

  // User settings
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      default_reminder_time TEXT DEFAULT '19:00',
      enable_sound INTEGER DEFAULT 1,
      enable_vibration INTEGER DEFAULT 1,
      selected_pet TEXT DEFAULT 'cat',
      pet_level INTEGER DEFAULT 1,
      pet_experience INTEGER DEFAULT 0,
      total_points INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      last_completed_date TEXT,
      cat_food INTEGER DEFAULT 0
    );
  `);

  // Points history
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS points_history (
      id TEXT PRIMARY KEY,
      points INTEGER NOT NULL,
      reason TEXT NOT NULL,
      task_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id)
    );
  `);

  // Daily stats
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      date TEXT PRIMARY KEY,
      total_tasks INTEGER DEFAULT 0,
      completed_tasks INTEGER DEFAULT 0,
      incomplete_tasks INTEGER DEFAULT 0,
      abandoned_tasks INTEGER DEFAULT 0,
      completion_rate REAL DEFAULT 0
    );
  `);
};

// Initialize default settings
const initDefaultSettings = async () => {
  if (!db) return;

  const result = await db.getAllAsync('SELECT * FROM user_settings WHERE id = 1');
  if (result.length === 0) {
    await db.runAsync(
      `INSERT INTO user_settings (id, default_reminder_time, enable_sound, enable_vibration,
        selected_pet, pet_level, pet_experience, total_points, streak_days)
       VALUES (1, '19:00', 1, 1, 'cat', 1, 0, 0, 0)`
    );
  }
};

// ========== Task Operations ==========

export const createTask = async (task) => {
  if (!db) throw new Error('Database not initialized');

  const id = uuidv4();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO tasks (id, title, category, subject, task_type, planned_date, status,
      reminder_time, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      task.title,
      task.category,
      task.subject || null,
      task.taskType || null,
      task.plannedDate,
      'pending',
      task.reminderTime || null,
      now,
      now,
    ]
  );

  // Update daily stats
  await updateDailyStats(task.plannedDate);

  return id;
};

export const getTasksByDate = async (date) => {
  if (!db) throw new Error('Database not initialized');

  const tasks = await db.getAllAsync(
    `SELECT * FROM tasks WHERE planned_date = ? ORDER BY created_at DESC`,
    [date]
  );

  return tasks.map(formatTask);
};

export const getRolledTasks = async () => {
  if (!db) throw new Error('Database not initialized');

  const tasks = await db.getAllAsync(
    `SELECT * FROM tasks WHERE status = 'pending' AND rolled_from IS NOT NULL ORDER BY created_at DESC`
  );

  return tasks.map(formatTask);
};

export const updateTaskStatus = async (taskId, status, additionalData = {}) => {
  if (!db) throw new Error('Database not initialized');

  const now = new Date().toISOString();
  let updateFields = ['status = ?', 'updated_at = ?'];
  let values = [status, now];

  if (status === 'completed') {
    updateFields.push('completed_at = ?');
    values.push(now);
  }

  if (status === 'incomplete') {
    if (additionalData.reason) {
      updateFields.push('incomplete_reason = ?');
      values.push(additionalData.reason);
    }
    if (additionalData.description) {
      updateFields.push('incomplete_description = ?');
      values.push(additionalData.description);
    }
    if (additionalData.photos) {
      updateFields.push('incomplete_photos = ?');
      values.push(JSON.stringify(additionalData.photos));
    }
    if (additionalData.voiceNote) {
      updateFields.push('voice_note = ?');
      values.push(additionalData.voiceNote);
    }
  }

  values.push(taskId);

  await db.runAsync(
    `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
    values
  );

  // Get task to update stats
  const task = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (task) {
    await updateDailyStats(task.planned_date);
  }
};

export const rollTask = async (taskId, newDate, reason = '') => {
  if (!db) throw new Error('Database not initialized');

  const task = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (!task) throw new Error('Task not found');

  const rollId = uuidv4();
  const now = new Date().toISOString();

  // Create roll history
  await db.runAsync(
    `INSERT INTO task_roll_history (id, task_id, from_date, to_date, reason, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [rollId, taskId, task.planned_date, newDate, reason, now]
  );

  // Create new task (rolled task)
  const newTaskId = uuidv4();
  await db.runAsync(
    `INSERT INTO tasks (id, title, category, subject, task_type, planned_date, status,
      reminder_time, rolled_from, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newTaskId,
      task.title,
      task.category,
      task.subject,
      task.task_type,
      newDate,
      'pending',
      task.reminder_time,
      taskId,
      now,
      now,
    ]
  );

  // Mark original task as rolled (we'll treat it as completed in stats)
  await db.runAsync(
    `UPDATE tasks SET status = 'completed', updated_at = ? WHERE id = ?`,
    [now, taskId]
  );

  await updateDailyStats(task.planned_date);
  await updateDailyStats(newDate);

  return newTaskId;
};

export const deleteTask = async (taskId) => {
  if (!db) throw new Error('Database not initialized');

  const task = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (task) {
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [taskId]);
    await updateDailyStats(task.planned_date);
  }
};

export const updateTaskReminder = async (taskId, reminderTime) => {
  if (!db) throw new Error('Database not initialized');

  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE tasks SET reminder_time = ?, updated_at = ? WHERE id = ?`,
    [reminderTime, now, taskId]
  );
};

// ========== Stats Operations ==========

const updateDailyStats = async (date) => {
  if (!db) return;

  const stats = await db.getFirstAsync(
    `SELECT
      COUNT(*) as total_tasks,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
      SUM(CASE WHEN status = 'incomplete' THEN 1 ELSE 0 END) as incomplete_tasks,
      SUM(CASE WHEN status = 'abandoned' THEN 1 ELSE 0 END) as abandoned_tasks
    FROM tasks WHERE planned_date = ?`,
    [date]
  );

  const total = stats.total_tasks || 0;
  const completed = stats.completed_tasks || 0;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  await db.runAsync(
    `INSERT OR REPLACE INTO daily_stats
     (date, total_tasks, completed_tasks, incomplete_tasks, abandoned_tasks, completion_rate)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [date, total, completed, stats.incomplete_tasks || 0, stats.abandoned_tasks || 0, completionRate]
  );
};

export const getDailyStats = async (date) => {
  if (!db) throw new Error('Database not initialized');

  const stats = await db.getFirstAsync(
    'SELECT * FROM daily_stats WHERE date = ?',
    [date]
  );

  return stats || {
    date,
    total_tasks: 0,
    completed_tasks: 0,
    incomplete_tasks: 0,
    abandoned_tasks: 0,
    completion_rate: 0,
  };
};

export const getMonthlyStats = async (year, month) => {
  if (!db) throw new Error('Database not initialized');

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const stats = await db.getAllAsync(
    `SELECT * FROM daily_stats
     WHERE date >= ? AND date <= ?
     ORDER BY date`,
    [startDate, endDate]
  );

  return stats;
};

export const getSubjectStats = async (startDate, endDate) => {
  if (!db) throw new Error('Database not initialized');

  const stats = await db.getAllAsync(
    `SELECT
      subject,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
    FROM tasks
    WHERE category = 'in-class'
      AND planned_date >= ? AND planned_date <= ?
      AND subject IS NOT NULL
    GROUP BY subject`,
    [startDate, endDate]
  );

  return stats;
};

// ========== Points Operations ==========

export const addPoints = async (points, reason, taskId = null) => {
  if (!db) throw new Error('Database not initialized');

  const id = uuidv4();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO points_history (id, points, reason, task_id, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, points, reason, taskId, now]
  );

  // Update total points
  await db.runAsync(
    `UPDATE user_settings SET total_points = total_points + ? WHERE id = 1`,
    [points]
  );

  // Add experience to pet
  const expGain = Math.floor(points / 2);
  await addPetExperience(expGain);

  return id;
};

export const getPointsHistory = async (limit = 50) => {
  if (!db) throw new Error('Database not initialized');

  return await db.getAllAsync(
    `SELECT * FROM points_history ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
};

// ========== Settings Operations ==========

export const getSettings = async () => {
  if (!db) throw new Error('Database not initialized');

  const settings = await db.getFirstAsync('SELECT * FROM user_settings WHERE id = 1');
  return settings || {};
};

export const updateSettings = async (updates) => {
  if (!db) throw new Error('Database not initialized');

  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(1); // id

  await db.runAsync(
    `UPDATE user_settings SET ${fields} WHERE id = ?`,
    values
  );
};

// ========== Pet Operations ==========

export const addPetExperience = async (exp) => {
  if (!db) throw new Error('Database not initialized');

  const settings = await getSettings();
  const newExp = (settings.pet_experience || 0) + exp;
  let newLevel = settings.pet_level || 1;

  // Level up logic
  const levelThresholds = [0, 100, 300, 600, 1000, 1500];
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (newExp >= levelThresholds[i]) {
      newLevel = i + 1;
      break;
    }
  }

  await db.runAsync(
    `UPDATE user_settings SET pet_experience = ?, pet_level = ? WHERE id = 1`,
    [newExp, newLevel]
  );

  return { newExp, newLevel, leveledUp: newLevel > settings.pet_level };
};

// ========== Streak Operations ==========

export const updateStreak = async () => {
  if (!db) throw new Error('Database not initialized');

  const settings = await getSettings();
  const today = new Date().toISOString().split('T')[0];
  const lastCompleted = settings.last_completed_date;

  let newStreak = settings.streak_days || 0;

  if (lastCompleted) {
    const lastDate = new Date(lastCompleted);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1; // Continue streak
    } else if (diffDays > 1) {
      newStreak = 1; // Reset streak
    }
  } else {
    newStreak = 1;
  }

  await db.runAsync(
    `UPDATE user_settings SET streak_days = ?, last_completed_date = ? WHERE id = 1`,
    [newStreak, today]
  );

  return newStreak;
};

// ========== Utility ==========

const formatTask = (task) => {
  return {
    ...task,
    incomplete_photos: task.incomplete_photos ? JSON.parse(task.incomplete_photos) : [],
  };
};

// Get all pending tasks for reminder check
export const getPendingTasks = async () => {
  if (!db) throw new Error('Database not initialized');

  const today = new Date().toISOString().split('T')[0];
  const tasks = await db.getAllAsync(
    `SELECT * FROM tasks WHERE status = 'pending' AND planned_date <= ?`,
    [today]
  );

  return tasks.map(formatTask);
};

// ========== Cat Food Operations ==========

export const addCatFood = async (amount) => {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    `UPDATE user_settings SET cat_food = cat_food + ? WHERE id = 1`,
    [amount]
  );

  return getSettings();
};

export const useCatFood = async (amount = 1) => {
  if (!db) throw new Error('Database not initialized');

  const settings = await getSettings();

  if (settings.cat_food < amount) {
    return { success: false, message: '猫粮不足' };
  }

  await db.runAsync(
    `UPDATE user_settings SET cat_food = cat_food - ? WHERE id = 1`,
    [amount]
  );

  return { success: true, remaining: settings.cat_food - amount };
};

export const buyCatFood = async (bowls) => {
  if (!db) throw new Error('Database not initialized');

  const settings = await getSettings();
  const cost = bowls * 10; // 10 points per bowl

  if (settings.total_points < cost) {
    return { success: false, message: '积分不足' };
  }

  await db.runAsync(
    `UPDATE user_settings SET total_points = total_points - ?, cat_food = cat_food + ? WHERE id = 1`,
    [cost, bowls]
  );

  // Add points history
  await addPoints(-cost, `购买${bowls}碗猫粮`);

  return { success: true };
};

// Complete task with evaluation
export const completeTaskWithEvaluation = async (taskId, evaluation = {}) => {
  if (!db) throw new Error('Database not initialized');

  const now = new Date().toISOString();

  // Calculate points
  let points = 10; // Base points
  let positiveTags = 0;

  if (evaluation.attitude === 'serious') positiveTags++;
  if (evaluation.writing === 'standard') positiveTags++;
  if (evaluation.draft === 'careful') positiveTags++;
  if (evaluation.marks === 'marked') positiveTags++;

  points += positiveTags * 2;

  // Update task
  await db.runAsync(
    `UPDATE tasks SET status = 'completed', completed_at = ?, updated_at = ? WHERE id = ?`,
    [now, now, taskId]
  );

  // Add cat food (10 points = 1 food)
  const foodGained = Math.floor(points / 10);
  if (foodGained > 0) {
    await addCatFood(foodGained);
  }

  // Add points
  await addPoints(points, '完成任务', taskId);

  // Update streak
  await updateStreak();

  // Update stats
  const task = await db.getFirstAsync('SELECT * FROM tasks WHERE id = ?', [taskId]);
  if (task) {
    await updateDailyStats(task.planned_date);
  }

  return { points, foodGained, evaluation };
};

export { db };
