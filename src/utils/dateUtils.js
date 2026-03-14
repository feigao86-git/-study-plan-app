// Get today's date string (YYYY-MM-DD)
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// Get yesterday's date string
export const getYesterdayString = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

// Format date for display
export const formatDateDisplay = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today.toISOString().split('T')[0]) {
    return '今天';
  } else if (dateString === yesterday.toISOString().split('T')[0]) {
    return '昨天';
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

// Format time from HH:mm string
export const formatTimeDisplay = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

// Get days in month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

// Get month name
export const getMonthName = (month) => {
  const names = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return names[month - 1];
};

// Get week day name
export const getWeekDayName = (date) => {
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return names[date.getDay()];
};

// Check if date is weekend
export const isWeekend = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Add days to date
export const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Get current time string (HH:mm)
export const getCurrentTimeString = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// Get week dates
export const getWeekDates = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start

  const monday = new Date(date.setDate(diff));
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  return weekDates;
};

// Format date for Chinese
export const formatDateCN = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDay = getWeekDayName(date);

  return `${year}年${month}月${day}日 ${weekDay}`;
};
