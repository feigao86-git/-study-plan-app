import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, PET_LEVELS } from '../constants/theme';

// Simple pet using emoji and animations
const PET_EMOJIS = {
  cat: ['😺', '😸', '😹', '😻', '😼'],
  dog: ['🐶', '🐕', '🦮', '🐕‍🦺', '🐩'],
  dragon: ['🐲', '🐉', '🦕', '🦖', '🐊'],
  rabbit: ['🐰', '🐇', '🐿️', '🦫', '🐁'],
  panda: ['🐼', '🐻', '🐨', '🐯', '🦁'],
};

const PET_NAMES = {
  cat: '小猫咪',
  dog: '小狗狗',
  dragon: '小龙',
  rabbit: '小兔子',
  panda: '小熊猫',
};

export default function PetDisplay({
  petType = 'cat',
  level = 1,
  experience = 0,
  completionRate = 0,
  isHappy = true,
  animated = true,
}) {
  // Determine pet emoji based on level and mood
  const petSet = PET_EMOJIS[petType] || PET_EMOJIS.cat;
  const petIndex = Math.min(level - 1, petSet.length - 1);
  const petEmoji = petSet[petIndex];

  // Determine pet mood
  const getMood = () => {
    if (completionRate >= 80) return 'happy';
    if (completionRate >= 50) return 'neutral';
    return 'sad';
  };

  const mood = getMood();
  const moodColors = {
    happy: COLORS.petHappy,
    neutral: COLORS.petNeutral,
    sad: COLORS.petSad,
  };

  const moodText = {
    happy: '开心',
    neutral: '一般',
    sad: '失落',
  };

  // Get level info
  const levelInfo = PET_LEVELS.find(l => l.level === level) || PET_LEVELS[0];
  const nextLevel = PET_LEVELS.find(l => l.level === level + 1);
  const expProgress = nextLevel ? (experience / nextLevel.minExp) * 100 : 100;

  return (
    <View style={styles.container}>
      {/* Pet Bubble */}
      <View style={[styles.bubble, { backgroundColor: moodColors[mood] + '30' }]}>
        <Text style={styles.petEmoji}>{petEmoji}</Text>
      </View>

      {/* Pet Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.petName}>
          {PET_NAMES[petType]}
        </Text>
        <Text style={[styles.moodText, { color: moodColors[mood] }]}>
          心情: {moodText[mood]}
        </Text>
      </View>

      {/* Level Badge */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv.{level}</Text>
        <Text style={styles.levelName}>{levelInfo.name}</Text>
      </View>

      {/* Experience Bar */}
      <View style={styles.expContainer}>
        <View style={styles.expBar}>
          <View
            style={[
              styles.expFill,
              { width: `${expProgress}%` }
            ]}
          />
        </View>
        <Text style={styles.expText}>
          经验: {experience}{nextLevel ? ` / ${nextLevel.minExp}` : ''}
        </Text>
      </View>

      {/* Status Message */}
      <Text style={styles.statusMessage}>
        {mood === 'happy' && '主人今天表现超棒！🎉'}
        {mood === 'neutral' && '继续加油，我会更开心哦~'}
        {mood === 'sad' && '快点完成任务吧，我想开心起来...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  bubble: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  petEmoji: {
    fontSize: 64,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  moodText: {
    fontSize: 14,
    marginTop: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  levelText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  levelName: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 6,
  },
  expContainer: {
    width: '80%',
    alignItems: 'center',
  },
  expBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  expFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 6,
  },
  statusMessage: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 12,
    textAlign: 'center',
  },
});
