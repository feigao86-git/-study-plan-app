import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

export default function ProgressRing({
  size = 120,
  strokeWidth = 10,
  progress = 0,
  totalTasks = 0,
  completedTasks = 0,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Determine color based on progress
  const getColor = () => {
    if (progress >= 80) return COLORS.success;
    if (progress >= 50) return COLORS.warning;
    return COLORS.primary;
  };

  const progressColor = getColor();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          stroke={COLORS.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        <Text style={styles.label}>今日完成</Text>
        <Text style={styles.count}>
          {completedTasks}/{totalTasks}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotateZ: '0deg' }],
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  count: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
