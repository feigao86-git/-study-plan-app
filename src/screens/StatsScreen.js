import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SUBJECTS } from '../constants/theme';
import { getMonthlyStats, getSubjectStats, getSettings } from '../services/database';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'subjects'

  const loadData = async () => {
    try {
      const [monthData, subjectData, settingsData] = await Promise.all([
        getMonthlyStats(currentYear, currentMonth),
        getSubjectStats(
          `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
          `${currentYear}-${String(currentMonth).padStart(2, '0')}-31`
        ),
        getSettings(),
      ]);

      setMonthlyStats(monthData);
      setSubjectStats(subjectData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [currentMonth, currentYear])
  );

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

  // Calculate overall stats
  const totalTasks = monthlyStats.reduce((sum, s) => sum + s.total_tasks, 0);
  const totalCompleted = monthlyStats.reduce((sum, s) => sum + s.completed_tasks, 0);
  const overallRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;
  const activeDays = monthlyStats.filter(s => s.total_tasks > 0).length;

  // Generate calendar data
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth - 1, 1).getDay();

  const getDayStats = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthlyStats.find(s => s.date === dateStr);
  };

  const getHeatmapColor = (rate) => {
    if (rate === 0) return COLORS.border;
    if (rate < 30) return COLORS.success + '30';
    if (rate < 60) return COLORS.success + '50';
    if (rate < 80) return COLORS.success + '70';
    return COLORS.success;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>学习统计</Text>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{currentYear}年 {currentMonth}月</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{Math.round(overallRate)}%</Text>
          <Text style={styles.summaryLabel}>月完成率</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalCompleted}/{totalTasks}</Text>
          <Text style={styles.summaryLabel}>完成任务</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{activeDays}</Text>
          <Text style={styles.summaryLabel}>活跃天数</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{settings.streak_days || 0}</Text>
          <Text style={styles.summaryLabel}>连续天数</Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calendar' && styles.tabActive]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabTextActive]}>
            日历视图
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'subjects' && styles.tabActive]}
          onPress={() => setActiveTab('subjects')}
        >
          <Text style={[styles.tabText, activeTab === 'subjects' && styles.tabTextActive]}>
            学科分析
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {activeTab === 'calendar' ? (
          /* Calendar Heatmap */
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>每日完成热力图</Text>

            {/* Weekday headers */}
            <View style={styles.weekdayRow}>
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <Text key={d} style={styles.weekdayText}>{d}</Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
              {/* Empty cells for padding */}
              {Array.from({ length: firstDayWeekday }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.calendarCell} />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const stats = getDayStats(day);
                const rate = stats ? stats.completion_rate : 0;
                const hasTasks = stats && stats.total_tasks > 0;

                return (
                  <View
                    key={day}
                    style={[
                      styles.calendarCell,
                      { backgroundColor: hasTasks ? getHeatmapColor(rate) : COLORS.background }
                    ]}
                  >
                    <Text style={[
                      styles.calendarDay,
                      hasTasks && rate >= 80 && styles.calendarDayLight
                    ]}>
                      {day}
                    </Text>
                    {hasTasks && (
                      <Text style={[
                        styles.calendarRate,
                        rate >= 80 && styles.calendarDayLight
                      ]}>
                        {Math.round(rate)}%
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendText}>低</Text>
              <View style={[styles.legendBox, { backgroundColor: COLORS.border }]} />
              <View style={[styles.legendBox, { backgroundColor: COLORS.success + '30' }]} />
              <View style={[styles.legendBox, { backgroundColor: COLORS.success + '50' }]} />
              <View style={[styles.legendBox, { backgroundColor: COLORS.success + '70' }]} />
              <View style={[styles.legendBox, { backgroundColor: COLORS.success }]} />
              <Text style={styles.legendText}>高</Text>
            </View>
          </View>
        ) : (
          /* Subject Analysis */
          <View style={styles.subjectSection}>
            <Text style={styles.sectionTitle}>各学科完成情况</Text>

            {subjectStats.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📚</Text>
                <Text style={styles.emptyText}>本月暂无学科数据</Text>
              </View>
            ) : (
              subjectStats.map(stat => {
                const subject = SUBJECTS.find(s => s.id === stat.subject);
                if (!subject) return null;

                const rate = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;

                return (
                  <View key={stat.subject} style={styles.subjectCard}>
                    <View style={styles.subjectHeader}>
                      <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
                        <Text style={{ fontSize: 20 }}>{subject.icon}</Text>
                      </View>
                      <View style={styles.subjectInfo}>
                        <Text style={styles.subjectName}>{subject.name}</Text>
                        <Text style={styles.subjectCount}>
                          完成 {stat.completed}/{stat.total} 任务
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

            {/* Subject Tips */}
            {subjectStats.length > 0 && (
              <View style={styles.tipsBox}>
                <Text style={styles.tipsTitle}>💡 学习建议</Text>
                <Text style={styles.tipsText}>
                  根据本月数据，建议继续保持优势学科，同时加强对薄弱学科的练习。
                  坚持每日学习，保持连续打卡记录！
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.primary,
    paddingHorizontal: 12,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: COLORS.white,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  calendarSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: (width - 80) / 7,
    height: (width - 80) / 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
  },
  calendarDay: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  calendarDayLight: {
    color: COLORS.white,
  },
  calendarRate: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginHorizontal: 8,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  subjectSection: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.white,
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  subjectCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIcon: {
    width: 44,
    height: 44,
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
    fontSize: 22,
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
  tipsBox: {
    backgroundColor: COLORS.secondary + '20',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
});
