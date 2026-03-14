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
import { COLORS, PET_LEVELS, REWARD_VOICES } from '../constants/theme';
import { getSettings, addPoints, addPetExperience, useCatFood, buyCatFood } from '../services/database';
import { speakReward } from '../utils/speechUtils';
import PetDisplay from '../components/PetDisplay';

const PET_TYPES = [
  { id: 'cat', name: '小猫咪', emoji: '😺', unlockCost: 0 },
  { id: 'dog', name: '小狗狗', emoji: '🐶', unlockCost: 100 },
  { id: 'rabbit', name: '小兔子', emoji: '🐰', unlockCost: 200 },
  { id: 'dragon', name: '小龙', emoji: '🐲', unlockCost: 500 },
  { id: 'panda', name: '小熊猫', emoji: '🐼', unlockCost: 1000 },
];

const PET_ITEMS = [
  { id: 'hat', name: '小帽子', emoji: '🎩', cost: 50 },
  { id: 'bow', name: '蝴蝶结', emoji: '🎀', cost: 80 },
  { id: 'glasses', name: '眼镜', emoji: '👓', cost: 100 },
  { id: 'crown', name: '皇冠', emoji: '👑', cost: 200 },
];

export default function PetScreen() {
  const [settings, setSettings] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pet'); // 'pet' | 'shop'

  const loadData = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Load pet data error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleInteract = async (type) => {
    switch (type) {
      case 'feed':
        const feedResult = await useCatFood(1);
        if (feedResult.success) {
          await addPetExperience(5);
          speakReward('complete');
          await loadData();
        } else {
          alert('猫粮不足，请去购买猫粮！');
        }
        break;
      case 'pet':
        await addPetExperience(2);
        speakReward('encourage');
        await loadData();
        break;
      case 'play':
        await addPetExperience(10);
        speakReward('complete');
        await loadData();
        break;
    }
  };

  const handleBuyCatFood = async (bowls) => {
    const result = await buyCatFood(bowls);
    if (result.success) {
      await loadData();
      alert(`成功购买${bowls}碗猫粮！`);
    } else {
      alert(result.message || '积分不足');
    }
  };

  const handleUnlockPet = async (petType) => {
    if ((settings.total_points || 0) < petType.unlockCost) {
      return;
    }

    await addPoints(-petType.unlockCost, `解锁宠物: ${petType.name}`);
    // Update selected pet
    await loadData();
  };

  const currentLevel = PET_LEVELS.find(l => l.level === (settings.pet_level || 1));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的宠物</Text>
        <View style={styles.headerRight}>
          <View style={styles.foodBadge}>
            <Text style={styles.foodIcon}>🥣</Text>
            <Text style={styles.foodText}>{settings.cat_food || 0}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsIcon}>⭐</Text>
            <Text style={styles.pointsText}>{settings.total_points || 0}</Text>
          </View>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pet' && styles.tabActive]}
          onPress={() => setActiveTab('pet')}
        >
          <Text style={[styles.tabText, activeTab === 'pet' && styles.tabTextActive]}>
            宠物
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shop' && styles.tabActive]}
          onPress={() => setActiveTab('shop')}
        >
          <Text style={[styles.tabText, activeTab === 'shop' && styles.tabTextActive]}>
            商店
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'pet' ? (
          <>
            {/* Pet Display */}
            <View style={styles.petSection}>
              <PetDisplay
                petType={settings.selected_pet || 'cat'}
                level={settings.pet_level || 1}
                experience={settings.pet_experience || 0}
                completionRate={75}
                isHappy={true}
              />
            </View>

            {/* Interact Buttons */}
            <View style={styles.interactSection}>
              <Text style={styles.sectionTitle}>与宠物互动</Text>
              <View style={styles.interactRow}>
                <TouchableOpacity
                  style={styles.interactBtn}
                  onPress={() => handleInteract('feed')}
                >
                  <Text style={styles.interactIcon}>🍖</Text>
                  <Text style={styles.interactText}>喂食</Text>
                  <Text style={styles.interactSubtext}>+5经验</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.interactBtn}
                  onPress={() => handleInteract('pet')}
                >
                  <Text style={styles.interactIcon}>✋</Text>
                  <Text style={styles.interactText}>抚摸</Text>
                  <Text style={styles.interactSubtext}>+2经验</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.interactBtn}
                  onPress={() => handleInteract('play')}
                >
                  <Text style={styles.interactIcon}>🎾</Text>
                  <Text style={styles.interactText}>玩耍</Text>
                  <Text style={styles.interactSubtext}>+10经验</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Level Info */}
            <View style={styles.levelSection}>
              <Text style={styles.sectionTitle}>等级进度</Text>
              <View style={styles.levelList}>
                {PET_LEVELS.map((level, index) => (
                  <View
                    key={level.level}
                    style={[
                      styles.levelItem,
                      level.level === (settings.pet_level || 1) && styles.levelItemActive,
                      level.level < (settings.pet_level || 1) && styles.levelItemCompleted,
                    ]}
                  >
                    <Text style={styles.levelNum}>Lv.{level.level}</Text>
                    <Text style={styles.levelName}>{level.name}</Text>
                    <Text style={styles.levelExp}>需{level.minExp}经验</Text>
                    {level.level === (settings.pet_level || 1) && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentText}>当前</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* Shop Tab */
          <View style={styles.shopSection}>
            {/* Cat Food Shop */}
            <Text style={styles.sectionTitle}>🥣 购买猫粮 (10积分/碗)</Text>
            <View style={styles.foodShopRow}>
              {[1, 5, 10].map((bowls) => (
                <TouchableOpacity
                  key={bowls}
                  style={styles.foodBuyBtn}
                  onPress={() => handleBuyCatFood(bowls)}
                >
                  <Text style={styles.foodBuyEmoji}>🥣×{bowls}</Text>
                  <Text style={styles.foodBuyText}>{bowls * 10} 积分</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pets */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>解锁宠物</Text>
            <View style={styles.shopGrid}>
              {PET_TYPES.map(pet => {
                const isUnlocked = pet.unlockCost === 0 || settings.selected_pet === pet.id;
                const canAfford = (settings.total_points || 0) >= pet.unlockCost;

                return (
                  <View key={pet.id} style={styles.shopCard}>
                    <Text style={styles.shopEmoji}>{pet.emoji}</Text>
                    <Text style={styles.shopName}>{pet.name}</Text>
                    {isUnlocked ? (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedText}>已解锁</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.unlockBtn, !canAfford && styles.unlockBtnDisabled]}
                        onPress={() => handleUnlockPet(pet)}
                        disabled={!canAfford}
                      >
                        <Text style={styles.unlockText}>⭐ {pet.unlockCost}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Items */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>宠物装扮</Text>
            <View style={styles.shopGrid}>
              {PET_ITEMS.map(item => (
                <View key={item.id} style={styles.shopCard}>
                  <Text style={styles.shopEmoji}>{item.emoji}</Text>
                  <Text style={styles.shopName}>{item.name}</Text>
                  <TouchableOpacity style={styles.unlockBtn}>
                    <Text style={styles.unlockText}>⭐ {item.cost}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B' + '20',
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
  foodShopRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  foodBuyBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  foodBuyEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  foodBuyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
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
  petSection: {
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  interactSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  interactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  interactBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: 90,
  },
  interactIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  interactText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  interactSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  levelSection: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  levelList: {
    gap: 10,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  levelItemActive: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  levelItemCompleted: {
    backgroundColor: COLORS.success + '20',
  },
  levelNum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    width: 50,
  },
  levelName: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  levelExp: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  currentBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
  currentText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
  },
  shopSection: {
    padding: 16,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shopCard: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  shopEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  shopName: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  unlockBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unlockBtnDisabled: {
    backgroundColor: COLORS.gray,
  },
  unlockText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  unlockedBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unlockedText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
});
