import React, { useContext } from 'react';
import { AppContext } from '../App';

export default function ProfilePage() {
  const { data, updateSettings } = useContext(AppContext);
  const { settings, pointsHistory } = data;

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleClearData = () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      localStorage.removeItem('studyPlanData');
      window.location.reload();
    }
  };

  return (
    <div className="page profile-page">
      {/* Header */}
      <div className="header">
        <h1 style={{ fontSize: '20px', fontWeight: '700' }}>我的</h1>
      </div>

      {/* User Card */}
      <div className="user-card">
        <div className="avatar">👨‍🎓</div>
        <div className="user-info">
          <div className="user-name">学习小达人</div>
          <div className="user-streak">连续打卡 {settings.streakDays} 天 🔥</div>
        </div>
        <div className="points-display">
          <span className="emoji">⭐</span>
          <span className="value">{settings.totalPoints}</span>
          <span className="label">积分</span>
        </div>
      </div>

      {/* Cat Info */}
      <div className="section-card">
        <div className="section-title">我的猫咪</div>
        <div className="pet-info-card">
          <span className="emoji" style={{ fontSize: '60px' }}>🐱</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2C3E50' }}>
              小猫咪
            </div>
            <div style={{ fontSize: '14px', color: '#7F8C8D', marginTop: '4px' }}>
              🥣 猫粮库存: {settings.catFood} 碗
            </div>
          </div>
        </div>
      </div>

      {/* Points History */}
      <div className="section-card">
        <div className="section-title">积分记录</div>
        <div className="history-list">
          {pointsHistory.length === 0 ? (
            <div className="empty-text" style={{ textAlign: 'center', padding: '20px' }}>
              暂无积分记录
            </div>
          ) : (
            pointsHistory.slice(0, 10).map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-left">
                  <div className="history-reason">{item.reason}</div>
                  <div className="history-date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={`history-points ${item.points > 0 ? 'positive' : 'negative'}`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="section-card">
        <div className="section-title">设置</div>

        <div className="setting-item">
          <div className="setting-left">
            <span className="setting-icon">🔔</span>
            <span className="setting-text">声音提醒</span>
          </div>
          <div
            className={`toggle ${settings.enableSound ? 'active' : ''}`}
            onClick={() => handleToggle('enableSound')}
          ></div>
        </div>

        <div className="setting-item">
          <div className="setting-left">
            <span className="setting-icon">📳</span>
            <span className="setting-text">震动提醒</span>
          </div>
          <div
            className={`toggle ${settings.enableVibration ? 'active' : ''}`}
            onClick={() => handleToggle('enableVibration')}
          ></div>
        </div>

        <div className="setting-item">
          <div className="setting-left">
            <span className="setting-icon">⏰</span>
            <span className="setting-text">默认提醒时间</span>
          </div>
          <span className="setting-value">{settings.defaultReminderTime || '19:00'}</span>
        </div>
      </div>

      {/* About */}
      <div className="section-card">
        <div className="section-title">关于</div>

        <div className="setting-item">
          <span className="setting-text">版本</span>
          <span className="setting-value">1.0.0</span>
        </div>

        <div className="setting-item" style={{ borderBottom: 'none' }}>
          <span className="setting-text">开发者</span>
          <span className="setting-value">学习计划团队</span>
        </div>
      </div>

      {/* Clear Data */}
      <button className="clear-btn" onClick={handleClearData}>
        清除所有数据
      </button>

      <div style={{ height: '50px' }}></div>
    </div>
  );
}
