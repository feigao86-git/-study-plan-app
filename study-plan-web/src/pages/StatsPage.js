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

export default function StatsPage() {
  const { data } = useContext(AppContext);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('calendar');

  const monthTasks = useMemo(() => {
    return data.tasks.filter(t => {
      const date = new Date(t.plannedDate);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });
  }, [data.tasks, currentMonth, currentYear]);

  const stats = useMemo(() => {
    const total = monthTasks.length;
    const completed = monthTasks.filter(t => t.status === 'completed').length;
    const activeDays = new Set(monthTasks.map(t => t.plannedDate)).size;
    return {
      total,
      completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      activeDays
    };
  }, [monthTasks]);

  const subjectStats = useMemo(() => {
    const stats = {};
    Object.keys(SUBJECTS).forEach(id => {
      const tasks = monthTasks.filter(t => t.subject === id);
      if (tasks.length > 0) {
        stats[id] = {
          ...SUBJECTS[id],
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'completed').length
        };
      }
    });
    return Object.values(stats);
  }, [monthTasks]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth - 1, 1).getDay();

  const getDayStats = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const tasks = data.tasks.filter(t => t.plannedDate === dateStr);
    if (tasks.length === 0) return null;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getHeatmapColor = (rate) => {
    if (rate === null) return '#ECF0F1';
    if (rate >= 80) return '#2ECC71';
    if (rate >= 50) return 'rgba(46, 204, 113, 0.6)';
    if (rate >= 30) return 'rgba(46, 204, 113, 0.4)';
    return 'rgba(46, 204, 113, 0.2)';
  };

  const changeMonth = (delta) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="page stats-page">
      {/* Header */}
      <div className="header">
        <h1 style={{ fontSize: '20px', fontWeight: '700' }}>学习统计</h1>
      </div>

      {/* Month Selector */}
      <div className="month-selector">
        <button className="month-btn" onClick={() => changeMonth(-1)}>◀</button>
        <span className="month-text">{currentYear}年 {currentMonth}月</span>
        <button className="month-btn" onClick={() => changeMonth(1)}>▶</button>
      </div>

      {/* Summary Cards */}
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-number" style={{ color: stats.rate >= 80 ? '#2ECC71' : '#FF8C42' }}>
            {stats.rate}%
          </div>
          <div className="summary-label">月完成率</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{stats.completed}/{stats.total}</div>
          <div className="summary-label">完成任务</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{stats.activeDays}</div>
          <div className="summary-label">活跃天数</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{data.settings.streakDays}</div>
          <div className="summary-label">连续天数</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="stats-tabs">
        <button
          className={`stats-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          日历视图
        </button>
        <button
          className={`stats-tab ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          学科分析
        </button>
      </div>

      {activeTab === 'calendar' ? (
        /* Calendar View */
        <div className="calendar-section">
          <div className="section-title">每日完成热力图</div>

          <div className="weekday-row">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {Array.from({ length: firstDayWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-cell" style={{ background: 'transparent' }} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const rate = getDayStats(day);
              return (
                <div
                  key={day}
                  className="calendar-cell"
                  style={{ background: getHeatmapColor(rate) }}
                >
                  <span style={{ color: rate >= 80 ? '#fff' : '#2C3E50' }}>{day}</span>
                  {rate !== null && (
                    <span className="rate" style={{ color: rate >= 80 ? 'rgba(255,255,255,0.8)' : '#7F8C8D' }}>
                      {rate}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="legend">
            <span>低</span>
            <div className="legend-box" style={{ background: '#ECF0F1' }}></div>
            <div className="legend-box" style={{ background: 'rgba(46, 204, 113, 0.2)' }}></div>
            <div className="legend-box" style={{ background: 'rgba(46, 204, 113, 0.4)' }}></div>
            <div className="legend-box" style={{ background: 'rgba(46, 204, 113, 0.6)' }}></div>
            <div className="legend-box" style={{ background: '#2ECC71' }}></div>
            <span>高</span>
          </div>
        </div>
      ) : (
        /* Subject View */
        <div className="subject-stats">
          <div className="section-title">各学科完成情况</div>

          {subjectStats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <div className="empty-text">本月暂无学科数据</div>
            </div>
          ) : (
            subjectStats.map(subject => {
              const rate = subject.total > 0 ? Math.round((subject.completed / subject.total) * 100) : 0;
              return (
                <div key={subject.name} className="subject-card">
                  <div className="subject-header">
                    <div className="subject-icon" style={{ background: `${subject.color}20` }}>
                      <span>{subject.icon}</span>
                    </div>
                    <div className="subject-info">
                      <div className="subject-name">{subject.name}</div>
                      <div className="subject-count">完成 {subject.completed}/{subject.total} 任务</div>
                    </div>
                    <div className="subject-rate" style={{ color: subject.color }}>{rate}%</div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${rate}%`, background: subject.color }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}

          {subjectStats.length > 0 && (
            <div className="tips-box">
              <div className="tips-title">💡 学习建议</div>
              <div className="tips-text">
                根据本月数据，建议继续保持优势学科，同时加强对薄弱学科的练习。
                坚持每日学习，保持连续打卡记录！
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ height: '100px' }}></div>
    </div>
  );
}
