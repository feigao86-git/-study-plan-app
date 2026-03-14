// Color Palette
export const COLORS = {
  // Primary colors
  primary: '#FF8C42',      // 活力橙
  secondary: '#4ECDC4',    // 清新蓝

  // Status colors
  success: '#2ECC71',      // 成功绿
  warning: '#F1C40F',      // 提醒黄
  gray: '#95A5A6',         // 未完成灰
  danger: '#E74C3C',       // 放弃红

  // Background colors
  background: '#F8F9FA',
  white: '#FFFFFF',
  black: '#2C3E50',

  // Text colors
  text: '#2C3E50',
  textLight: '#7F8C8D',
  textMuted: '#BDC3C7',

  // Border colors
  border: '#ECF0F1',
  divider: '#E8E8E8',

  // Subject colors
  subjects: {
    chinese: '#E74C3C',    // 语文 - 红色
    math: '#3498DB',       // 数学 - 蓝色
    english: '#9B59B6',    // 英语 - 紫色
    physics: '#F39C12',    // 物理 - 橙色
    chemistry: '#1ABC9C',  // 化学 - 青色
    biology: '#27AE60',    // 生物 - 绿色
    history: '#E67E22',    // 历史 - 棕色
    geography: '#16A085',  // 地理 - 深绿
    politics: '#2980B9',   // 政治 - 深蓝
  },

  // Pet mood colors
  petHappy: '#FFD93D',
  petNeutral: '#95A5A6',
  petSad: '#E74C3C',
};

// Subjects configuration
export const SUBJECTS = [
  { id: 'chinese', name: '语文', icon: '📖', color: COLORS.subjects.chinese },
  { id: 'math', name: '数学', icon: '🔢', color: COLORS.subjects.math },
  { id: 'english', name: '英语', icon: '🔤', color: COLORS.subjects.english },
  { id: 'physics', name: '物理', icon: '⚡', color: COLORS.subjects.physics },
  { id: 'chemistry', name: '化学', icon: '🧪', color: COLORS.subjects.chemistry },
  { id: 'biology', name: '生物', icon: '🌱', color: COLORS.subjects.biology },
  { id: 'history', name: '历史', icon: '🏛️', color: COLORS.subjects.history },
  { id: 'geography', name: '地理', icon: '🌍', color: COLORS.subjects.geography },
  { id: 'politics', name: '政治', icon: '📜', color: COLORS.subjects.politics },
];

// Extracurricular types
export const EXTRACURRICULAR_TYPES = [
  { id: 'reading', name: '课外阅读', icon: '📚' },
  { id: 'hobby', name: '兴趣培养', icon: '🎨' },
  { id: 'sports', name: '运动锻炼', icon: '⚽' },
  { id: 'other', name: '其他', icon: '✨' },
];

// Task status
export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
  ABANDONED: 'abandoned',
};

// Points configuration
export const POINTS = {
  COMPLETE_TASK: 10,
  STREAK_7: 50,
  STREAK_30: 200,
  WEEKEND_TASK: 5,
  MONTHLY_90_PERCENT: 100,
};

// Pet levels
export const PET_LEVELS = [
  { level: 1, name: '幼崽', minExp: 0 },
  { level: 2, name: '成长', minExp: 100 },
  { level: 3, name: '成熟', minExp: 300 },
  { level: 4, name: '精英', minExp: 600 },
  { level: 5, name: '大师', minExp: 1000 },
];

// Reward voices
export const REWARD_VOICES = {
  complete: [
    '太棒了！继续保持！',
    '你做到了！为你骄傲！',
    '任务完成！宠物也开心得跳起来了！',
    '真厉害！继续加油！',
    '完成一个目标！再接再厉！',
  ],
  streak: [
    '连续{X}天完成！你是学习小达人！',
    '坚持就是胜利，继续保持！',
    '连续完成的记录又刷新了！',
  ],
  levelUp: [
    '恭喜升级！你的宠物也变得更强大了！',
    '升级啦！新的技能等你解锁！',
    '宠物升级！你真是个优秀的主人！',
  ],
  incomplete: [
    '没关系，下次一定能完成！',
    '不要灰心，调整状态再来！',
    '宠物相信你，下次加油！',
  ],
};

// Incomplete reasons
export const INCOMPLETE_REASONS = [
  { id: 'need-think', name: '题目需要继续思考', icon: '🤔' },
  { id: 'need-practice', name: '需要举一反三练习', icon: '✏️' },
  { id: 'other', name: '其他原因', icon: '📝' },
];

// Font sizes
export const FONTS = {
  tiny: 10,
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 24,
  title: 32,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
