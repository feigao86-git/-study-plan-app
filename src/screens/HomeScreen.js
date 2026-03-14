import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, POINTS, SUBJECTS } from '../constants/theme';
import {
  getTasksByDate,
  getRolledTasks,
  updateTaskStatus,
  rollTask,
  addPoints,
  getSettings,
  updateStreak,
  getDailyStats,
  completeTaskWithEvaluation,
} from '../services/database';
import { speakReward } from '../utils/speechUtils';
import { getTodayString, formatDateCN } from '../utils/dateUtils';
import PetDisplay from '../components/PetDisplay';
import ProgressRing from '../components/ProgressRing';
import TaskItem from '../components/TaskItem';
import EvaluationModal from '../components/EvaluationModal';
import PostponeModal from '../components/PostponeModal';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [rolledTasks, setRolledTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 });
  const [settings, setSettings] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [evalModalVisible, setEvalModalVisible] = useState(false);
  const [postponeModalVisible, setPostponeModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const today = getTodayString();

  // Load data
  const loadData = async () => {
    try {
      const [tasksData, rolledData, settingsData, dailyStats] = await Promise.all([
        getTasksByDate(today),
        getRolledTasks(),
        getSettings(),
        getDailyStats(today),
      ]);

      setTasks(tasksData);
      setRolledTasks(rolledData);
      setSettings(settingsData);
      setStats({
        total: dailyStats.total_tasks || 0,
        completed: dailyStats.completed_tasks || 0,
        rate: dailyStats.completion_rate || 0,
      });
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Handle complete task - show evaluation modal
  const handleComplete = (taskId) => {
    setSelectedTaskId(taskId);
    setEvalModalVisible(true);
  };

  // Handle evaluation submit
  const handleEvaluationSubmit = async (evaluation) => {
    try {
      setEvalModalVisible(false);

      const result = await completeTaskWithEvaluation(selectedTaskId, evaluation);

      // Show celebration
      Alert.alert(
        '🎉 任务完成！',
        `获得 ${result.points} 积分\n获得 ${result.foodGained} 碗猫粮🥣\n\n${result.evaluation.attitude === 'serious' ? '✓ 态度认真 +2\n' : ''}${result.evaluation.writing === 'standard' ? '✓ 书写规范 +2\n' : ''}${result.evaluation.draft === 'careful' ? '✓ 草稿认真 +2\n' : ''}${result.evaluation.marks === 'marked' ? '✓ 痕迹标注 +2' : ''}`
      );

      speakReward('complete');
      await loadData();
    } catch (error) {
      console.error('Complete task error:', error);
      Alert.alert('错误', '标记完成失败，请重试');
    }
  };

  // Handle incomplete
  const handleIncomplete = (taskId) => {
    navigation.navigate('IncompleteRecord', { taskId });
  };

  // Handle postpone - show postpone modal
  const handlePostpone = (taskId) => {
    setSelectedTaskId(taskId);
    setPostponeModalVisible(true);
  };

  // Handle postpone submit
  const handlePostponeSubmit = async (postponeData) => {
    try {
      setPostponeModalVisible(false);

      const { newDate, reason, photos, voiceNote } = postponeData;
      await rollTask(selectedTaskId, newDate, reason, photos, voiceNote);

      Alert.alert('成功', `任务已改期到 ${newDate}`);
      await loadData();
    } catch (error) {
      console.error('Postpone task error:', error);
      Alert.alert('错误', '改期失败');
    }
  };

  // Handle abandon
  const handleAbandon = async (taskId) => {
    try {
      await updateTaskStatus(taskId, 'abandoned');
      speakReward('incomplete');
      await loadData();
    } catch (error) {
      console.error('Abandon task error:', error);
    }
  };

  // Group tasks by category
  const inClassTasks = tasks.filter(t => t.category === 'in-class');
  const extraTasks = tasks.filter(t => t.category === 'extracurricular');

  // Get cat food count
  const catFoodCount = settings.cat_food || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{formatDateCN(today)}</Text>
          <Text style={styles.greeting}>今天也要加油哦！💪</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.foodBadge}>
            <Text style={styles.foodIcon}>🥣</Text>
            <Text style={styles.foodText}>{catFoodCount}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsIcon}>⭐</Text>
            <Text style={styles.pointsText}>{settings.total_points || 0}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Pet Display */}
        <View style={styles.petSection}>
          <PetDisplay
            petType={settings.selected_pet || 'cat'}
            level={settings.pet_level || 1}
            experience={settings.pet_experience || 0}
            completionRate={stats.rate}
            isHappy={stats.rate >= 60}
          />
        </View>

        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <ProgressRing
            progress={stats.rate}
            totalTasks={stats.total}
            completedTasks={stats.completed}
          />
          {settings.streak_days > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>
                🔥 连续 {settings.streak_days} 天
              </Text>
            </View>
          )}
        </View>

        {/* Add Task Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={styles.addButtonText}>+ 添加新任务</Text>
        </TouchableOpacity>

        {/* Task List */}
        <View style={styles.taskList}>
          {/* Rolled tasks (遗留任务) */}
          {rolledTasks.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={[styles.categoryTitle, styles.rolledTitle]}>
                📌 遗留任务 ({rolledTasks.filter(t => t.status === 'completed').length}/{rolledTasks.length})
              </Text>
              {rolledTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onPostpone={handlePostpone}
                  onAbandon={handleAbandon}
                  isRolled={true}
                />
              ))}
            </View>
          )}

          {/* In-class tasks */}
          {inClassTasks.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                📚 课内学习 ({inClassTasks.filter(t => t.status === 'completed').length}/{inClassTasks.length})
              </Text>
              {inClassTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onPostpone={handlePostpone}
                  onAbandon={handleAbandon}
                />
              ))}
            </View>
          )}

          {/* Extracurricular tasks */}
          {extraTasks.length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                🎯 课外学习 ({extraTasks.filter(t => t.status === 'completed').length}/{extraTasks.length})
              </Text>
              {extraTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onPostpone={handlePostpone}
                  onAbandon={handleAbandon}
                />
              ))}
            </View>
          )}

          {/* Empty state */}
          {tasks.length === 0 && rolledTasks.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>今天还没有任务</Text>
              <Text style={styles.emptySubtext}>点击上方按钮添加第一个任务吧！</Text>
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Evaluation Modal */}
      <EvaluationModal
        visible={evalModalVisible}
        onClose={() => setEvalModalVisible(false)}
        onSubmit={handleEvaluationSubmit}
      />

      {/* Postpone Modal */}
      <PostponeModal
        visible={postponeModalVisible}
        onClose={() => setPostponeModalVisible(false)}
        onSubmit={handlePostponeSubmit}
      />
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
  dateText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  petSection: {
    backgroundColor: COLORS.white,
    paddingBottom: 16,
  },
  progressSection: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  streakBadge: {
    marginTop: 12,
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakText: {
    color: COLORS.warning,
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  taskList: {
    paddingTop: 8,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 16,
    marginBottom: 8,
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
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  foodIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  foodText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  rolledTitle: {
    color: '#E67E22',
  },
});
