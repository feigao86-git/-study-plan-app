import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Setup notifications
export const setupNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Must use physical device for notifications');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get notification permissions');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: '任务提醒',
      importance: Notifications.AndroidImportance.HIGH,
      sound: true,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
};

// Schedule a reminder
export const scheduleReminder = async (taskId, title, reminderTime) => {
  try {
    // Cancel existing reminders for this task
    await cancelReminder(taskId);

    // Parse reminder time (HH:mm format)
    const [hours, minutes] = reminderTime.split(':').map(Number);

    // Create trigger for specific time
    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: false,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ 学习任务提醒',
        body: `该完成「${title}」啦！加油！`,
        data: { taskId, type: 'reminder' },
        sound: true,
      },
      trigger,
    });

    return notificationId;
  } catch (error) {
    console.error('Schedule reminder error:', error);
    return null;
  }
};

// Cancel reminder
export const cancelReminder = async (taskId) => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.data?.taskId === taskId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.error('Cancel reminder error:', error);
  }
};

// Schedule incomplete reminder (recurring)
export const scheduleIncompleteReminder = async (taskId, title, delayMinutes = 30) => {
  try {
    const trigger = {
      seconds: delayMinutes * 60,
      repeats: false,
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 未完成任务提醒',
        body: `「${title}」还没完成哦，要继续加油！`,
        data: { taskId, type: 'incomplete' },
        sound: true,
      },
      trigger,
    });

    return notificationId;
  } catch (error) {
    console.error('Schedule incomplete reminder error:', error);
    return null;
  }
};

// Schedule streak celebration
export const scheduleStreakCelebration = async (streakDays) => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 连续打卡成就！',
        body: `太棒了！你已经连续 ${streakDays} 天完成学习任务！`,
        data: { type: 'streak', streakDays },
        sound: true,
      },
      trigger: { seconds: 1 },
    });

    return notificationId;
  } catch (error) {
    console.error('Schedule streak celebration error:', error);
    return null;
  }
};

// Send immediate notification
export const sendImmediateNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: { seconds: 1 },
    });
  } catch (error) {
    console.error('Send immediate notification error:', error);
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Get scheduled notifications error:', error);
    return [];
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Cancel all notifications error:', error);
  }
};

// Set up notification listener
export const setNotificationListener = (callback) => {
  return Notifications.addNotificationReceivedListener((notification) => {
    callback?.(notification);
  });
};

// Set up notification response listener
export const setNotificationResponseListener = (callback) => {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    callback?.(response);
  });
};
