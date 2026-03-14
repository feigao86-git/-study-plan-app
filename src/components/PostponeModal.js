import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { getTodayString } from '../utils/dateUtils';

export default function PostponeModal({ visible, onClose, onSubmit }) {
  const [reason, setReason] = useState('think');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [photos, setPhotos] = useState([]);
  const [voiceNote, setVoiceNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = () => {
    if (!selectedDate) {
      Alert.alert('提示', '请选择改期日期');
      return;
    }

    onSubmit?.({
      newDate: selectedDate,
      newTime: selectedTime,
      reason: getReasonText(reason),
      description,
      photos,
      voiceNote,
    });

    // Reset form
    setReason('think');
    setDescription('');
    setPhotos([]);
    setVoiceNote('');
  };

  const getReasonText = (r) => {
    const map = {
      think: '题目需要继续思考',
      practice: '需要举一反三练习',
      other: '其他原因',
    };
    return map[r] || r;
  };

  const handleTakePhoto = () => {
    // Simulate photo capture
    const mockPhoto = `photo_${Date.now()}.jpg`;
    setPhotos([...photos, mockPhoto]);
    Alert.alert('提示', '已模拟拍照记录（实际应用将调用相机）');
  };

  const handleRecordVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceNote('这是模拟的语音转写内容：题目有些难度，需要再多思考');
      Alert.alert('提示', '语音录制完成（实际应用将调用语音识别）');
    } else {
      setIsRecording(true);
      // Auto stop after 3 seconds for demo
      setTimeout(() => {
        setIsRecording(false);
        setVoiceNote('这是模拟的语音转写内容：题目有些难度，需要再多思考');
      }, 3000);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>📅 改期处理</Text>
                <TouchableOpacity onPress={handleSubmit}>
                  <Text style={styles.saveBtn}>确认改期</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Reason Selection */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>改期原因</Text>
                  <View style={styles.reasonButtons}>
                    {[
                      { key: 'think', label: '💭 需要继续思考', desc: '题目需要更多时间思考' },
                      { key: 'practice', label: '📝 需要举一反三', desc: '需要额外练习巩固' },
                      { key: 'other', label: '📌 其他原因', desc: '自定义原因' },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.reasonBtn,
                          reason === item.key && styles.reasonBtnSelected,
                        ]}
                        onPress={() => setReason(item.key)}
                      >
                        <Text
                          style={[
                            styles.reasonBtnText,
                            reason === item.key && styles.reasonBtnTextSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={styles.reasonBtnDesc}>{item.desc}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Date & Time Selection */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>改期到</Text>
                  <View style={styles.dateTimeRow}>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>日期</Text>
                      <TextInput
                        style={styles.dateInput}
                        value={selectedDate}
                        onChangeText={setSelectedDate}
                        placeholder="YYYY-MM-DD"
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>时间</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={selectedTime}
                        onChangeText={setSelectedTime}
                        placeholder="HH:MM"
                      />
                    </View>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>详细说明（可选）</Text>
                  <TextInput
                    style={styles.textArea}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="描述具体情况..."
                    multiline
                    numberOfLines={4}
                  />
                </View>

                {/* Photo Capture */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📷 拍照记录</Text>
                  <TouchableOpacity
                    style={styles.photoBtn}
                    onPress={handleTakePhoto}
                  >
                    <Text style={styles.photoBtnText}>+ 添加照片</Text>
                  </TouchableOpacity>
                  {photos.length > 0 && (
                    <View style={styles.photoList}>
                      {photos.map((photo, index) => (
                        <View key={index} style={styles.photoItem}>
                          <Text style={styles.photoText}>📷 照片 {index + 1}</Text>
                          <TouchableOpacity
                            onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                          >
                            <Text style={styles.deletePhoto}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Voice Recording */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🎤 语音录入</Text>
                  <TouchableOpacity
                    style={[
                      styles.voiceBtn,
                      isRecording && styles.voiceBtnRecording,
                    ]}
                    onPress={handleRecordVoice}
                  >
                    <Text
                      style={[
                        styles.voiceBtnText,
                        isRecording && styles.voiceBtnTextRecording,
                      ]}
                    >
                      {isRecording ? '⏹ 录制中... (点击停止)' : '🎤 按住录音'}
                    </Text>
                  </TouchableOpacity>
                  {voiceNote ? (
                    <View style={styles.voiceNote}>
                      <Text style={styles.voiceNoteText}>{voiceNote}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Tip */}
                <View style={styles.tipBox}>
                  <Text style={styles.tipText}>
                    💡 改期后任务将移动到指定日期，原任务标记为已处理
                  </Text>
                </View>

                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  saveBtn: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  reasonButtons: {
    gap: 8,
  },
  reasonBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  reasonBtnSelected: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warning + '10',
  },
  reasonBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  reasonBtnTextSelected: {
    color: COLORS.warning,
  },
  reasonBtnDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 80,
    textAlignVertical: 'top',
  },
  photoBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  photoBtnText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  photoList: {
    marginTop: 10,
    gap: 8,
  },
  photoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
  },
  photoText: {
    fontSize: 13,
    color: COLORS.text,
  },
  deletePhoto: {
    color: COLORS.danger,
    fontSize: 16,
    padding: 4,
  },
  voiceBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  voiceBtnRecording: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  voiceBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  voiceBtnTextRecording: {
    color: COLORS.white,
  },
  voiceNote: {
    marginTop: 10,
    backgroundColor: COLORS.primary + '10',
    padding: 12,
    borderRadius: 8,
  },
  voiceNoteText: {
    fontSize: 13,
    color: COLORS.text,
  },
  tipBox: {
    backgroundColor: COLORS.warning + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.warning,
  },
});
