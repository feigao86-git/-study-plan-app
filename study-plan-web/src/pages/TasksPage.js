import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

const SUBJECTS = {
  chinese: { name: '语文', icon: '📖', color: '#E74C3C' },
  math: { name: '数学', icon: '🔢', color: '#3498DB' },
  english: { name: '英语', icon: '🔤', color: '#9B59B6' },
  physics: { name: '物理', icon: '⚡', color: '#F39C12' },
  chemistry: { name: '化学', icon: '🧪', color: '#1ABC9C' },
  biology: { name: '生物', icon: '🌱', color: '#27AE60' },
  history: { name: '历史', icon: '🏛️', color: '#E67E22' },
  geography: { name: '地理', icon: '🌍', color: '#16A085' },
  politics: { name: '政治', icon: '📜', color: '#2980B9' },
};

export default function TasksPage() {
  const { data, updateTaskStatus, deleteTask, addPoints } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const weekDates = [];
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  const filteredTasks = data.tasks.filter(t => t.plannedDate === selectedDate);
  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter(t => t.status === 'completed').length,
    rate: filteredTasks.length > 0
      ? Math.round((filteredTasks.filter(t => t.status === 'completed').length / filteredTasks.length) * 100)
      : 0
  };

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return '今天';
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[date.getDay()];
  };

  // 完成任务获得猫粮
  const handleComplete = (taskId) => {
    updateTaskStatus(taskId, 'completed');
    addPoints(10, '完成任务');
  };

  return (
    <div className="page tasks-page">
      <div className="tasks-header">
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2C3E50' }}>学习任务</h1>
      </div>

      {/* Date Selector */}
      <div className="date-selector">
        {weekDates.map(date => {
          const isSelected = date === selectedDate;
          const isToday = date === new Date().toISOString().split('T')[0];
          const dayNum = new Date(date).getDate();

          return (
            <div
              key={date}
              className={`date-item ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="day-name">{getDayName(date)}</span>
              <span className="day-num">{dayNum}</span>
              {isToday && <span className="today-badge">今天</span>}
            </div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <span className="stats-text">{formatDateDisplay(selectedDate)} · 完成 {stats.completed}/{stats.total} 任务</span>
        <span className="stats-rate" style={{ color: stats.rate >= 80 ? '#2ECC71' : '#FF8C42' }}>
          {stats.rate}%
        </span>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-text">这天没有任务</div>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="task-item">
              <div
                className={`task-status ${task.status}`}
                onClick={() => task.status === 'pending' && handleComplete(task.id)}
              >
                {task.status === 'completed' ? '✓' : '○'}
              </div>
              <div className="task-info">
                <div className={`task-title ${task.status}`}>{task.title}</div>
                <div className="task-meta">
                  {task.subject && (
                    <span className={`task-tag ${task.subject}`}>
                      {SUBJECTS[task.subject]?.icon} {SUBJECTS[task.subject]?.name}
                    </span>
                  )}
                  {task.category === 'extracurricular' && (
                    <span className="task-tag extracurricular">🎯 课外</span>
                  )}
                  {task.reminderTime && (
                    <span className="task-tag reminder">⏰ {task.reminderTime}</span>
                  )}
                </div>
              </div>
              <button
                className="task-btn incomplete"
                onClick={() => deleteTask(task.id)}
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ height: '100px' }}></div>
    </div>
  );
}
