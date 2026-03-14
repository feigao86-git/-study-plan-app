import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SUBJECTS } from '../constants/theme';
import { getTasksByDate, getDailyStats } from '../services/database';
import { getTodayString, formatDateDisplay, addDays, getWeekDates } from '../utils/dateUtils';
import TaskItem from '../components/TaskItem';

export default function TaskScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'

  const weekDates = getWeekDates(getTodayString());

  const loadData = async () => {
    try {
      const [tasksData, statsData] = await Promise.all([
        getTasksByDate(selectedDate),
        getDailyStats(selectedDate),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Load tasks error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Calculate subject stats for the week
  const getSubjectStats = () => {
    const subjectMap = {};
    SUBJECTS.forEach(s => {
      subjectMap[s.id] = { ...s, total: 0, completed: 0 };
    });

    tasks.forEach(task => {
      if (task.subject && subjectMap[task.subject]) {
        subjectMap[task.subject].total++;
        if (task.status === 'completed') {
          subjectMap[task.subject].completed++;
        }
      }
    });

    return Object.values(subjectMap).filter(s => s.total > 0);
  };

  const subjectStats = getSubjectStats();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>学习任务</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'day' && styles.toggleBtnActive]}
            onPress={() => setViewMode('day')}
          >
            <Text style={[styles.toggleText, viewMode === 'day' && styles.toggleTextActive]}>
              按日期
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'week' && styles.toggleBtnActive]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>
              按学科
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'day' ? (
        <>
          {/* Date Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateSelector}
            contentContainerStyle={styles.dateSelectorContent}
          >
            {weekDates.map(date => {
              const isSelected = date === selectedDate;
              const isToday = date === getTodayString();
              const dayName = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][
                new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1
              ];
              const dayNum = new Date(date).getDate();

              return (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateItem,
                    isSelected && styles.dateItemSelected,
                    isToday && styles.dateItemToday
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[
                    styles.dayName,
                    isSelected && styles.dateTextSelected
                  ]}>
                    {dayName}
                  </Text>
                  <Text style={[
                    styles.dayNum,
                    isSelected && styles.dateTextSelected
                  ]}>
                    {dayNum}
                  </Text>
                  {isToday && <Text style={styles.todayIndicator}>今天</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Stats Summary */}
          <View style={styles.statsBar}>
            <Text style={styles.statsText}>
              {formatDateDisplay(selectedDate)} · 完成 {stats.completed_tasks || 0}/{stats.total_tasks || 0} 任务
            </Text>
            <Text style={[styles.rateText, { color: stats.completion_rate >= 80 ? COLORS.success : COLORS.primary }]}>
              {Math.round(stats.completion_rate || 0)}%
            </Text>
          </View>

          {/* Task List */}
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={styles.taskList}
          >
            {tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyText}>这天没有任务</Text>
              </View>
            ) : (
              tasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
            <View style={{ height: 100 }} />
          </ScrollView>
        </>
      ) : (
        /* Subject View */
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          style={styles.subjectView}
        >
          <Text style={styles.subjectViewTitle}>各学科任务完成情况</Text>
          {subjectStats.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyText}>暂无学科数据</Text>
            </View>
          ) : (
            subjectStats.map(subject => {
              const rate = subject.total > 0 ? (subject.completed / subject.total) * 100 : 0;
              return (
                <View key={subject.id} style={styles.subjectCard}>
                  <View style={styles.subjectHeader}>
                    <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
                      <Text style={{ fontSize: 24 }}>{subject.icon}</Text>
                    </View>
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectCount}>
                        {subject.completed}/{subject.total} 完成
                      </Text>
                    </View>
                    <Text style={[styles.subjectRate, { color: subject.color }]}>
                      {Math.round(rate)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${rate}%`, backgroundColor: subject.color }
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.white,
  },
  toggleText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  dateSelector: {
    maxHeight: 90,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateSelectorContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dateItem: {
    width: 56,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  dateItemSelected: {
    backgroundColor: COLORS.primary,
  },
  dateItemToday: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dayName: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  dayNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dateTextSelected: {
    color: COLORS.white,
  },
  todayIndicator: {
    fontSize: 9,
    color: COLORS.primary,
    position: 'absolute',
    bottom: 4,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.text,
  },
  rateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  subjectView: {
    flex: 1,
    padding: 16,
  },
  subjectViewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  subjectCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  subjectCount: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  subjectRate: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
