import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { COLORS, INCOMPLETE_REASONS } from '../constants/theme';
import { updateTaskStatus } from '../services/database';

export default function IncompleteRecordScreen({ navigation, route }) {
  const { taskId } = route.params;
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [voiceNote, setVoiceNote] = useState('');

  // Simulate photo capture
  const handleTakePhoto = () => {
    // In real app, use Camera API
    Alert.alert('提示', '这里会打开相机拍摄题目照片');
    // Mock adding a photo
    setPhotos([...photos, `photo_${Date.now()}`]);
  };

  // Simulate voice recording
  const handleRecordVoice = () => {
    // In real app, use Audio recording and Speech-to-Text
    Alert.alert('提示', '这里会开始录音并转文字');
    setVoiceNote('需要更多时间理解题目（语音转写示例）');
  };

  const handleSave = async () => {
    if (!selectedReason) {
      Alert.alert('提示', '请选择未完成原因');
      return;
    }

    try {
      await updateTaskStatus(taskId, 'incomplete', {
        reason: selectedReason,
        description: description.trim(),
        photos,
        voiceNote: voiceNote.trim(),
      });

      Alert.alert('已记录', '任务已标记为未完成，原因已记录', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Save incomplete record error:', error);
      Alert.alert('错误', '保存失败');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtn}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.title}>记录未完成原因</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Reason Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>未完成原因</Text>
          <View style={styles.reasonList}>
            {INCOMPLETE_REASONS.map(reason => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonItem,
                  selectedReason === reason.id && styles.reasonItemActive
                ]}
                onPress={() => setSelectedReason(reason.id)}
              >
                <Text style={styles.reasonIcon}>{reason.icon}</Text>
                <Text style={[
                  styles.reasonText,
                  selectedReason === reason.id && styles.reasonTextActive
                ]}>
                  {reason.name}
                </Text>
                {selectedReason === reason.id && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photo Capture */}
        <View style={styles.section}>
          <Text style={styles.label}>拍照记录（可选）</Text>
          <View style={styles.photoSection}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoThumb}>
                <Text style={styles.photoPlaceholder}>📷</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoBtn} onPress={handleTakePhoto}>
              <Text style={styles.addPhotoIcon}>+</Text>
              <Text style={styles.addPhotoText}>拍照</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Voice Note */}
        <View style={styles.section}>
          <Text style={styles.label}>语音说明（可选）</Text>
          <TouchableOpacity style={styles.voiceBtn} onPress={handleRecordVoice}>
            <Text style={styles.voiceIcon}>🎤</Text>
            <Text style={styles.voiceText}>
              {voiceNote ? '重新录音' : '按住录音'}
            </Text>
          </TouchableOpacity>
          {voiceNote ? (
            <View style={styles.voiceResult}>
              <Text style={styles.voiceResultText}>{voiceNote}</Text>
            </View>
          ) : null}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>文字说明（可选）</Text>
          <TextInput
            style={styles.textArea}
            placeholder="详细描述遇到的问题..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
          <Text style={styles.charCount}>{description.length}/200</Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>💡 小贴士</Text>
          <Text style={styles.tipsText}>
            记录未完成原因有助于分析问题，下次可以更好地完成！{'\n'}
            这个任务会被标记为未完成，你可以选择滚动到明天或稍后处理。
          </Text>
        </View>
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
  reasonList: {
    gap: 10,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  reasonItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  reasonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  reasonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  photoSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoThumb: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    fontSize: 32,
  },
  addPhotoBtn: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoIcon: {
    fontSize: 28,
    color: COLORS.primary,
  },
  addPhotoText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  voiceIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  voiceText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  voiceResult: {
    backgroundColor: COLORS.secondary + '20',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  voiceResultText: {
    fontSize: 14,
    color: COLORS.text,
  },
  textArea: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  tipsBox: {
    backgroundColor: COLORS.warning + '20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warning,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
});
