import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { COLORS } from '../constants/theme';

export default function EvaluationModal({ visible, onClose, onSubmit }) {
  const [evaluations, setEvaluations] = useState({
    attitude: null,
    writing: null,
    draft: null,
    marks: null,
  });

  const handleSelect = (category, value) => {
    setEvaluations(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit?.(evaluations);
    // Reset after submit
    setEvaluations({
      attitude: null,
      writing: null,
      draft: null,
      marks: null,
    });
  };

  const getPositiveCount = () => {
    let count = 0;
    if (evaluations.attitude === 'serious') count++;
    if (evaluations.writing === 'standard') count++;
    if (evaluations.draft === 'careful') count++;
    if (evaluations.marks === 'marked') count++;
    return count;
  };

  const positiveCount = getPositiveCount();
  const totalPoints = 10 + positiveCount * 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>✓ 完成任务评价</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                评价本次任务完成情况，每个正面标签+2积分
              </Text>

              {/* 学习态度 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📝 学习态度</Text>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      evaluations.attitude === 'serious' && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect('attitude', 'serious')}
                  >
                    <Text style={[
                      styles.optionText,
                      evaluations.attitude === 'serious' && styles.optionTextSelected,
                    ]}>态度认真</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      styles.optionNegative,
                      evaluations.attitude === 'casual' && styles.optionNegativeSelected,
                    ]}
                    onPress={() => handleSelect('attitude', 'casual')}
                  >
                    <Text style={[
                      styles.optionText,
                      styles.optionTextNegative,
                      evaluations.attitude === 'casual' && styles.optionTextNegativeSelected,
                    ]}>态度不认真</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 书写规范 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✍️ 书写规范</Text>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      evaluations.writing === 'standard' && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect('writing', 'standard')}
                  >
                    <Text style={[
                      styles.optionText,
                      evaluations.writing === 'standard' && styles.optionTextSelected,
                    ]}>书写规范</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      styles.optionNegative,
                      evaluations.writing === 'messy' && styles.optionNegativeSelected,
                    ]}
                    onPress={() => handleSelect('writing', 'messy')}
                  >
                    <Text style={[
                      styles.optionText,
                      styles.optionTextNegative,
                      evaluations.writing === 'messy' && styles.optionTextNegativeSelected,
                    ]}>书写潦草</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 草稿情况 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📄 草稿情况</Text>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      evaluations.draft === 'careful' && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect('draft', 'careful')}
                  >
                    <Text style={[
                      styles.optionText,
                      evaluations.draft === 'careful' && styles.optionTextSelected,
                    ]}>草稿认真</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      styles.optionNegative,
                      evaluations.draft === 'none' && styles.optionNegativeSelected,
                    ]}
                    onPress={() => handleSelect('draft', 'none')}
                  >
                    <Text style={[
                      styles.optionText,
                      styles.optionTextNegative,
                      evaluations.draft === 'none' && styles.optionTextNegativeSelected,
                    ]}>无草稿</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 做题痕迹 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🖍️ 做题痕迹</Text>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      evaluations.marks === 'marked' && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect('marks', 'marked')}
                  >
                    <Text style={[
                      styles.optionText,
                      evaluations.marks === 'marked' && styles.optionTextSelected,
                    ]}>痕迹标注</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      styles.optionNegative,
                      evaluations.marks === 'none' && styles.optionNegativeSelected,
                    ]}
                    onPress={() => handleSelect('marks', 'none')}
                  >
                    <Text style={[
                      styles.optionText,
                      styles.optionTextNegative,
                      evaluations.marks === 'none' && styles.optionTextNegativeSelected,
                    ]}>无标注</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Points Preview */}
              <View style={styles.pointsPreview}>
                <Text style={styles.pointsText}>
                  预计获得: <Text style={styles.pointsNumber}>{totalPoints}</Text> 积分
                </Text>
                <Text style={styles.pointsDetail}>
                  基础10分 + 评价标签 {positiveCount} × 2分
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
              >
                <Text style={styles.submitBtnText}>确认完成</Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeBtn: {
    fontSize: 20,
    color: COLORS.textLight,
    padding: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
  },
  optionNegative: {
    borderColor: COLORS.border,
  },
  optionNegativeSelected: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + '10',
  },
  optionText: {
    fontSize: 13,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.success,
    fontWeight: '600',
  },
  optionTextNegative: {
    color: COLORS.textLight,
  },
  optionTextNegativeSelected: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  pointsPreview: {
    backgroundColor: COLORS.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    color: COLORS.text,
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pointsDetail: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.success,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
