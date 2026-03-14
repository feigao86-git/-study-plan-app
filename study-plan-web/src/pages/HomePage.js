import React, { useState, useContext, useMemo } from 'react';
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

const EXTRACURRICULAR_TYPES = {
  reading: { name: '课外阅读', icon: '📚' },
  hobby: { name: '兴趣培养', icon: '🎨' },
  sports: { name: '运动锻炼', icon: '⚽' },
  other: { name: '其他', icon: '✨' },
};

// 根据积分计算猫粮数量: 10积分=1个猫粮
const calculateCatFood = (points) => Math.floor(points / 10);

export default function HomePage() {
  const { data, updateTaskStatus, addPoints, setShowAddTask } = useContext(AppContext);
  const [celebration, setCelebration] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = data.tasks.filter(t => t.plannedDate === today);

  const stats = useMemo(() => {
    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.status === 'completed').length;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, rate };
  }, [todayTasks]);

  const getMood = () => {
    if (stats.rate >= 80) return { type: 'happy', text: '开心', emoji: '😸' };
    if (stats.rate >= 50) return { type: 'neutral', text: '一般', emoji: '😺' };
    return { type: 'sad', text: '饿了', emoji: '😿' };
  };
  const mood = getMood();

  const handleComplete = (taskId) => {
    updateTaskStatus(taskId, 'completed');

    // 计算奖励: 基础10积分
    const basePoints = 10;
    const foodCount = calculateCatFood(basePoints); // 1个猫粮

    // 显示猫粮庆祝效果
    setCelebration({
      catEmoji: mood.emoji,
      foodCount: foodCount,
      points: basePoints,
      totalPoints: data.settings.totalPoints + basePoints
    });

    addPoints(basePoints, '完成任务');

    setTimeout(() => setCelebration(null), 3000);
  };

  const inClassTasks = todayTasks.filter(t => t.category === 'in-class');
  const extraTasks = todayTasks.filter(t => t.category === 'extracurricular');

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`;
  };

  // 渲染猫粮碗
  const renderFoodBowl = (count) => {
    const bowls = [];
    for (let i = 0; i < count; i++) {
      bowls.push(
        <span key={i} style={{ fontSize: '40px', animation: `bounce 0.5s ${i * 0.1}s ease` }}>
          🥣
        </span>
      );
    }
    return bowls;
  };

  return (
    <div className="page home-page">
      {/* Header */}
      <header className="header">
        <div>
          <div className="header-title">{formatDate(today)}</div>
          <div className="header-greeting">今天也要加油哦！💪</div>
        </div>
        <div className="points-badge">
          <span>⭐</span>
          <span>{data.settings.totalPoints}</span>
        </div>
      </header>

      {/* Cat Display Section */}
      <div className="pet-section" style={{ background: 'linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 100%)' }}>
        <div className="pet-bubble" style={{
          background: stats.rate >= 80 ? 'rgba(46, 204, 113, 0.2)' : stats.rate >= 50 ? 'rgba(255, 193, 7, 0.2)' : 'rgba(231, 76, 60, 0.2)',
          border: '4px solid #fff',
          boxShadow: '0 8px 32px rgba(255, 140, 66, 0.3)'
        }}>
          <span style={{ fontSize: '90px' }}>{mood.emoji}</span>
        </div>
        <div className="pet-name" style={{ fontSize: '20px', fontWeight: '700' }}>小猫咪</div>
        <div style={{ color: stats.rate >= 50 ? '#27AE60' : '#E74C3C', fontSize: '14px', marginTop: '4px' }}>
          心情: {mood.text}
        </div>

        {/* 猫粮库存显示 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '16px',
          padding: '10px 20px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '20px'
        }}>
          <span style={{ fontSize: '24px' }}>🥣</span>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#FF8C42' }}>
            猫粮库存: {data.settings.catFood} 碗
          </span>
        </div>

        <div className="pet-message" style={{ marginTop: '12px' }}>
          {stats.rate >= 80 && '主人今天表现超棒！小猫咪很开心！🎉'}
          {stats.rate >= 50 && stats.rate < 80 && '继续加油，小猫咪想多吃点猫粮~'}
          {stats.rate < 50 && '快点完成任务吧，小猫咪饿了...'}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="progress-section">
        <div className="progress-ring">
          <svg width="140" height="140">
            <circle className="progress-ring-bg" cx="70" cy="70" r="60" />
            <circle
              className={`progress-ring-fill ${stats.rate >= 80 ? 'high' : ''}`}
              cx="70"
              cy="70"
              r="60"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - stats.rate / 100)}`}
            />
          </svg>
          <div className="progress-text">
            <div className="progress-percent">{Math.round(stats.rate)}%</div>
            <div className="progress-label">今日完成</div>
            <div className="progress-count">{stats.completed}/{stats.total}</div>
          </div>
        </div>
        {data.settings.streakDays > 0 && (
          <div className="streak-badge">
            🔥 连续 {data.settings.streakDays} 天
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button className="btn btn-primary btn-block add-task-btn" onClick={() => setShowAddTask(true)}>
        + 添加新任务
      </button>

      {/* Task List */}
      <div className="task-list">
        {inClassTasks.length > 0 && (
          <div className="category-section">
            <div className="category-title">
              📚 课内学习 ({inClassTasks.filter(t => t.status === 'completed').length}/{inClassTasks.length})
            </div>
            {inClassTasks.map(task => (
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
                    {task.reminderTime && (
                      <span className="task-tag reminder">⏰ {task.reminderTime}</span>
                    )}
                  </div>
                </div>
                {task.status === 'pending' && (
                  <div className="task-actions">
                    <button className="task-btn complete" onClick={() => handleComplete(task.id)}>
                      完成
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {extraTasks.length > 0 && (
          <div className="category-section">
            <div className="category-title">
              🎯 课外学习 ({extraTasks.filter(t => t.status === 'completed').length}/{extraTasks.length})
            </div>
            {extraTasks.map(task => (
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
                    <span className="task-tag extracurricular">
                      {EXTRACURRICULAR_TYPES[task.taskType]?.icon} {EXTRACURRICULAR_TYPES[task.taskType]?.name}
                    </span>
                  </div>
                </div>
                {task.status === 'pending' && (
                  <div className="task-actions">
                    <button className="task-btn complete" onClick={() => handleComplete(task.id)}>
                      完成
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {todayTasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-text">今天还没有任务</div>
            <div className="empty-subtext">点击上方按钮添加第一个任务吧！</div>
          </div>
        )}
      </div>

      {/* Cat Food Celebration Modal */}
      {celebration && (
        <div className="celebration-overlay">
          <div className="celebration-content" style={{ padding: '30px 40px' }}>
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>{celebration.catEmoji}</div>
            <div style={{ fontSize: '48px', margin: '20px 0' }}>
              🥣 × {celebration.foodCount}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#FF8C42', marginBottom: '8px' }}>
              获得猫粮!
            </div>
            <div style={{ fontSize: '14px', color: '#7F8C8D' }}>
              完成任务 +{celebration.points} 积分 = {celebration.foodCount}碗猫粮
            </div>
            <div style={{ marginTop: '16px', padding: '10px 20px', background: '#FFF0E6', borderRadius: '20px', color: '#FF8C42', fontWeight: '600' }}>
              ⭐ 总积分: {celebration.totalPoints}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.2); }
        }
      `}</style>

      <div style={{ height: '100px' }}></div>
    </div>
  );
}
