import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SUBJECTS, TASK_STATUS } from '../constants/theme';
import { formatTimeDisplay } from '../utils/dateUtils';

export default function TaskItem({
  task,
  onComplete,
  onPostpone,
  onAbandon,
  onEdit,
  isRolled = false,
}) {
  // Get subject info
  const subjectInfo = SUBJECTS.find(s => s.id === task.subject);

  // Get status style
  const getStatusStyle = () => {
    switch (task.status) {
      case TASK_STATUS.COMPLETED:
        return { color: COLORS.success, text: '已完成', icon: '✓' };
      case TASK_STATUS.INCOMPLETE:
        return { color: COLORS.gray, text: '未完成', icon: '!' };
      case TASK_STATUS.ABANDONED:
        return { color: COLORS.danger, text: '已放弃', icon: '×' };
      default:
        return { color: isRolled ? COLORS.warning : COLORS.primary, text: isRolled ? '遗留' : '待完成', icon: '○' };
    }
  };

  const statusStyle = getStatusStyle();

  // Handle complete action
  const handleComplete = () => {
    if (task.status === TASK_STATUS.PENDING) {
      onComplete?.(task.id);
    }
  };

  // Handle postpone action
  const handlePostpone = () => {
    Alert.alert(
      '改期处理',
      '选择处理方式',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '改期',
          onPress: () => onPostpone?.(task.id),
        },
        {
          text: '放弃',
          onPress: () => onAbandon?.(task.id),
          style: 'destructive',
        },
      ]
    );
  };

  // Handle abandon action
  const handleAbandon = () => {
    Alert.alert(
      '放弃任务',
      `确定要放弃「${task.title}」吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定放弃',
          onPress: () => onAbandon?.(task.id),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={[styles.container, task.status === TASK_STATUS.COMPLETED && styles.completed]}>
      {/* Left: Status indicator */}
      <TouchableOpacity
        style={[styles.statusIndicator, { backgroundColor: statusStyle.color + '20' }]}
        onPress={handleComplete}
        disabled={task.status !== TASK_STATUS.PENDING}
      >
        <Text style={[styles.statusIcon, { color: statusStyle.color }]}>
          {statusStyle.icon}
        </Text>
      </TouchableOpacity>

      {/* Middle: Task info */}
      <View style={styles.infoContainer}>
        <Text style={[
          styles.title,
          task.status === TASK_STATUS.COMPLETED && styles.completedText
        ]}>
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          {subjectInfo && !isRolled && (
            <View style={[styles.tag, { backgroundColor: subjectInfo.color + '20' }]}>
              <Text style={[styles.tagText, { color: subjectInfo.color }]}>
                {subjectInfo.icon} {subjectInfo.name}
              </Text>
            </View>
          )}

          {isRolled && (
            <View style={[styles.tag, { backgroundColor: COLORS.warning + '20' }]}>
              <Text style={[styles.tagText, { color: COLORS.warning }]}>
                📌 遗留
              </Text>
            </View>
          )}

          {task.category === 'extracurricular' && !isRolled && (
            <View style={[styles.tag, { backgroundColor: COLORS.secondary + '20' }]}>
              <Text style={[styles.tagText, { color: COLORS.secondary }]}>
                课外
              </Text>
            </View>
          )}

          {task.reminder_time && (
            <View style={styles.reminderTag}>
              <Text style={styles.reminderText}>
                ⏰ {formatTimeDisplay(task.reminder_time)}
              </Text>
            </View>
          )}
        </View>

        {task.rolled_from && (
          <Text style={styles.rolledTag}>📌 来自 {task.rolled_from}</Text>
        )}
        {task.reason && (
          <Text style={styles.reasonTag}>💭 {task.reason}</Text>
        )}
      </View>

      {/* Right: Actions */}
      {task.status === TASK_STATUS.PENDING && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.completeBtn]}
            onPress={handleComplete}
          >
            <Text style={styles.actionBtnText}>完成</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.postponeBtn]}
            onPress={handlePostpone}
          >
            <Text style={[styles.actionBtnText, { color: COLORS.warning }]}>改期</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completed: {
    opacity: 0.7,
  },
  statusIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  reminderTag: {
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reminderText: {
    fontSize: 11,
    color: COLORS.warning,
    fontWeight: '500',
  },
  rolledTag: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
  },
  reasonTag: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  completeBtn: {
    backgroundColor: COLORS.success + '20',
  },
  postponeBtn: {
    backgroundColor: COLORS.warning + '20',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
});
