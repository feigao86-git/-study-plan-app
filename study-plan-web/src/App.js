import React, { useState, useEffect } from 'react';
import './styles.css';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import PetPage from './pages/PetPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';

const defaultData = {
  tasks: [
    { id: '1', title: '完成数学作业第23页', category: 'in-class', subject: 'math', plannedDate: new Date().toISOString().split('T')[0], status: 'pending', reminderTime: '19:00' },
    { id: '2', title: '背诵古诗《静夜思》', category: 'in-class', subject: 'chinese', plannedDate: new Date().toISOString().split('T')[0], status: 'completed', completedAt: new Date().toISOString(), reminderTime: '19:30' },
    { id: '3', title: '英语单词记忆20个', category: 'in-class', subject: 'english', plannedDate: new Date().toISOString().split('T')[0], status: 'pending', reminderTime: '20:00' },
    { id: '4', title: '课外阅读30分钟', category: 'extracurricular', taskType: 'reading', plannedDate: new Date().toISOString().split('T')[0], status: 'completed', completedAt: new Date().toISOString(), reminderTime: '20:30' }
  ],
  settings: {
    totalPoints: 150,
    streakDays: 5,
    catFood: 3, // 猫粮数量
    enableSound: true,
    enableVibration: true
  },
  pointsHistory: [
    { id: '1', points: 10, reason: '完成任务', createdAt: new Date().toISOString() },
    { id: '2', points: 10, reason: '完成任务', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', points: 50, reason: '连续7天完成', createdAt: new Date(Date.now() - 172800000).toISOString() }
  ]
};

export const AppContext = React.createContext();

function App() {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('studyPlanData');
    setData(saved ? JSON.parse(saved) : defaultData);
  }, []);

  useEffect(() => {
    if (data) localStorage.setItem('studyPlanData', JSON.stringify(data));
  }, [data]);

  const updateTaskStatus = (taskId, status) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status, completedAt: status === 'completed' ? new Date().toISOString() : null } : t)
    }));
  };

  const addTask = (task) => {
    const newTask = { id: Date.now().toString(), ...task, status: 'pending', createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const deleteTask = (taskId) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== taskId) }));
  };

  const addPoints = (points, reason) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, totalPoints: prev.settings.totalPoints + points },
      pointsHistory: [{ id: Date.now().toString(), points, reason, createdAt: new Date().toISOString() }, ...prev.pointsHistory]
    }));
  };

  const updateSettings = (newSettings) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }));
  };

  // 购买猫粮: 10积分 = 1个猫粮
  const buyCatFood = (amount) => {
    const cost = amount * 10;
    if (data.settings.totalPoints >= cost) {
      setData(prev => ({
        ...prev,
        settings: { ...prev.settings, totalPoints: prev.settings.totalPoints - cost, catFood: prev.settings.catFood + amount }
      }));
      return true;
    }
    return false;
  };

  // 投喂猫粮
  const feedCat = () => {
    if (data.settings.catFood > 0) {
      setData(prev => ({
        ...prev,
        settings: { ...prev.settings, catFood: prev.settings.catFood - 1 }
      }));
      return true;
    }
    return false;
  };

  if (!data) return <div className="loading">加载中...</div>;

  return (
    <AppContext.Provider value={{ data, updateTaskStatus, addTask, deleteTask, addPoints, updateSettings, buyCatFood, feedCat, setShowAddTask }}>
      <div className="app">
        <main className="main-content">
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'tasks' && <TasksPage />}
          {currentPage === 'pet' && <PetPage />}
          {currentPage === 'stats' && <StatsPage />}
          {currentPage === 'profile' && <ProfilePage />}
        </main>

        {showAddTask && (
          <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <button className="modal-close" onClick={() => setShowAddTask(false)}>取消</button>
                <div className="modal-title">添加任务</div>
                <button className="modal-close" style={{ color: '#FF8C42' }} onClick={() => {
                  const title = document.getElementById('taskTitle').value;
                  if (title) {
                    addTask({ title, category: 'in-class', subject: 'math', plannedDate: new Date().toISOString().split('T')[0], reminderTime: '19:00' });
                    setShowAddTask(false);
                  }
                }}>保存</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">任务名称</label>
                  <input type="text" id="taskTitle" className="form-input" placeholder="例如：完成数学作业第23页" />
                </div>
                <div className="form-group">
                  <label className="form-label">学科</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {['📖 语文', '🔢 数学', '🔤 英语', '⚡ 物理', '🧪 化学', '🌱 生物', '🏛️ 历史', '🌍 地理', '📜 政治'].map(s => (
                      <button key={s} className="subject-item">{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="bottom-nav">
          {['home', 'tasks', 'pet', 'stats', 'profile'].map(page => (
            <button key={page} className={`nav-item ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>
              <span className="nav-icon">{{ home: '🏠', tasks: '📝', pet: '🐱', stats: '📊', profile: '👤' }[page]}</span>
              <span className="nav-label">{{ home: '首页', tasks: '任务', pet: '宠物', stats: '统计', profile: '我的' }[page]}</span>
            </button>
          ))}
        </nav>
      </div>
    </AppContext.Provider>
  );
}

export default App;
