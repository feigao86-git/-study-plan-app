import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { COLORS, SUBJECTS, EXTRACURRICULAR_TYPES } from '../constants/theme';
import { createTask } from '../services/database';
import { getTodayString, getCurrentTimeString } from '../utils/dateUtils';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('in-class');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [reminderTime, setReminderTime] = useState('19:00');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Time picker state
  const [tempHour, setTempHour] = useState(19);
  const [tempMinute, setTempMinute] = useState(0);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入任务名称');
      return;
    }

    if (category === 'in-class' && !selectedSubject) {
      Alert.alert('提示', '请选择学科');
      return;
    }

    if (category === 'extracurricular' && !selectedType) {
      Alert.alert('提示', '请选择类型');
      return;
    }

    try {
      const timeStr = `${String(tempHour).padStart(2, '0')}:${String(tempMinute).padStart(2, '0')}`;
      await createTask({
        title: title.trim(),
        category,
        subject: selectedSubject,
        taskType: selectedType,
        plannedDate: getTodayString(),
        reminderTime: timeStr,
      });

      Alert.alert('成功', '任务已添加', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Save task error:', error);
      Alert.alert('错误', '保存失败，请重试');
    }
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  const confirmTime = () => {
    setShowTimePicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtn}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.title}>添加任务</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Task Name */}
        <View style={styles.section}>
          <Text style={styles.label}>任务名称</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：完成数学作业第23页"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>任务分类</Text>
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                category === 'in-class' && styles.categoryBtnActive
              ]}
              onPress={() => setCategory('in-class')}
            >
              <Text style={[
                styles.categoryText,
                category === 'in-class' && styles.categoryTextActive
              ]}>📚 课内学习</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                category === 'extracurricular' && styles.categoryBtnActive
              ]}
              onPress={() => setCategory('extracurricular')}
            >
              <Text style={[
                styles.categoryText,
                category === 'extracurricular' && styles.categoryTextActive
              ]}>🎯 课外学习</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subject/Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>
            {category === 'in-class' ? '选择学科' : '选择类型'}
          </Text>
          <View style={styles.grid}>
            {category === 'in-class' ? (
              SUBJECTS.map(subject => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.gridItem,
                    selectedSubject === subject.id && {
                      backgroundColor: subject.color + '30',
                      borderColor: subject.color
                    }
                  ]}
                  onPress={() => setSelectedSubject(subject.id)}
                >
                  <Text style={styles.gridIcon}>{subject.icon}</Text>
                  <Text style={[
                    styles.gridText,
                    selectedSubject === subject.id && { color: subject.color }
                  ]}>{subject.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              EXTRACURRICULAR_TYPES.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.gridItem,
                    selectedType === type.id && {
                      backgroundColor: COLORS.secondary + '30',
                      borderColor: COLORS.secondary
                    }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Text style={styles.gridIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.gridText,
                    selectedType === type.id && { color: COLORS.secondary }
                  ]}>{type.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* Reminder Time */}
        <View style={styles.section}>
          <Text style={styles.label}>提醒时间</Text>
          <TouchableOpacity
            style={styles.timePickerBtn}
            onPress={openTimePicker}
          >
            <Text style={styles.timePickerText}>
              ⏰ {String(tempHour).padStart(2, '0')}:{String(tempMinute).padStart(2, '0')}
            </Text>
            <Text style={styles.timePickerHint}>点击修改</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>设置提醒时间</Text>
            <View style={styles.timeDisplay}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeUnit}>时</Text>
                <View style={styles.timeButtons}>
                  <TouchableOpacity
                    style={styles.timeBtn}
                    onPress={() => setTempHour(h => (h + 1) % 24)}
                  >
                    <Text style={styles.timeBtnText}>▲</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>
                    {String(tempHour).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    style={styles.timeBtn}
                    onPress={() => setTempHour(h => (h - 1 + 24) % 24)}
                  >
                    <Text style={styles.timeBtnText}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.timeColon}>:</Text>
              <View style={styles.timeColumn}>
                <Text style={styles.timeUnit}>分</Text>
                <View style={styles.timeButtons}>
                  <TouchableOpacity
                    style={styles.timeBtn}
                    onPress={() => setTempMinute(m => (m + 5) % 60)}
                  >
                    <Text style={styles.timeBtnText}>▲</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>
                    {String(tempMinute).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    style={styles.timeBtn}
                    onPress={() => setTempMinute(m => (m - 5 + 60) % 60)}
                  >
                    <Text style={styles.timeBtnText}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelModalBtn]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.cancelModalBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmModalBtn]}
                onPress={confirmTime}
              >
                <Text style={styles.confirmModalBtnText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cancelBtn: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  categoryBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  categoryText: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  gridIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  gridText: {
    fontSize: 12,
    color: COLORS.text,
  },
  timePickerBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  timePickerHint: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeColumn: {
    alignItems: 'center',
  },
  timeUnit: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  timeButtons: {
    alignItems: 'center',
  },
  timeBtn: {
    padding: 12,
  },
  timeBtnText: {
    fontSize: 20,
    color: COLORS.primary,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    width: 80,
    textAlign: 'center',
  },
  timeColon: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelModalBtn: {
    backgroundColor: COLORS.border,
  },
  cancelModalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  confirmModalBtn: {
    backgroundColor: COLORS.primary,
  },
  confirmModalBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
