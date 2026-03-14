import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/theme';
import { getSettings, updateSettings, getPointsHistory } from '../services/database';

export default function ProfileScreen() {
  const [settings, setSettings] = useState({});
  const [pointsHistory, setPointsHistory] = useState([]);

  const loadData = async () => {
    try {
      const [settingsData, historyData] = await Promise.all([
        getSettings(),
        getPointsHistory(10),
      ]);
      setSettings(settingsData);
      setPointsHistory(historyData);
    } catch (error) {
      console.error('Load profile error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const toggleSetting = async (key) => {
    try {
      const newValue = !settings[key];
      await updateSettings({ [key]: newValue ? 1 : 0 });
      await loadData();
    } catch (error) {
      console.error('Update setting error:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      '清除数据',
      '确定要清除所有数据吗？此操作不可恢复！',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定清除',
          style: 'destructive',
          onPress: async () => {
            // In real app, clear database
            Alert.alert('提示', '数据已清除');
          },
        },
      ]
    );
  };

  const getPetTypeName = (type) => {
    const names = {
      cat: '小猫咪',
      dog: '小狗狗',
      dragon: '小龙',
      rabbit: '小兔子',
      panda: '小熊猫',
    };
    return names[type] || '小猫咪';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
      </View>

      <ScrollView>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👨‍🎓</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>学习小达人</Text>
            <Text style={styles.userSubtitle}>
              连续打卡 {settings.streak_days || 0} 天 🔥
            </Text>
          </View>
          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsEmoji}>⭐</Text>
            <Text style={styles.pointsValue}>{settings.total_points || 0}</Text>
            <Text style={styles.pointsLabel}>积分</Text>
          </View>
        </View>

        {/* Pet Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的宠物</Text>
          <View style={styles.petCard}>
            <Text style={styles.petEmoji}>
              {settings.selected_pet === 'cat' && '😺'}
              {settings.selected_pet === 'dog' && '🐶'}
              {settings.selected_pet === 'dragon' && '🐲'}
              {settings.selected_pet === 'rabbit' && '🐰'}
              {settings.selected_pet === 'panda' && '🐼'}
              {!settings.selected_pet && '😺'}
            </Text>
            <View style={styles.petInfo}>
              <Text style={styles.petName}>
                {getPetTypeName(settings.selected_pet)}
              </Text>
              <Text style={styles.petLevel}>
                等级 {settings.pet_level || 1} · 经验 {settings.pet_experience || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Points History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>积分记录</Text>
          <View style={styles.historyList}>
            {pointsHistory.length === 0 ? (
              <Text style={styles.emptyText}>暂无积分记录</Text>
            ) : (
              pointsHistory.map((item, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyReason}>{item.reason}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.historyPoints,
                      item.points > 0 ? styles.pointsPositive : styles.pointsNegative,
                    ]}
                  >
                    {item.points > 0 ? '+' : ''}{item.points}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设置</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>声音提醒</Text>
            </View>
            <Switch
              value={!!settings.enable_sound}
              onValueChange={() => toggleSetting('enable_sound')}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '50' }}
              thumbColor={settings.enable_sound ? COLORS.primary : COLORS.gray}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📳</Text>
              <Text style={styles.settingText}>震动提醒</Text>
            </View>
            <Switch
              value={!!settings.enable_vibration}
              onValueChange={() => toggleSetting('enable_vibration')}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '50' }}
              thumbColor={settings.enable_vibration ? COLORS.primary : COLORS.gray}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⏰</Text>
              <Text style={styles.settingText}>默认提醒时间</Text>
            </View>
            <Text style={styles.settingValue}>
              {settings.default_reminder_time || '19:00'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>

          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>版本</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>开发者</Text>
            <Text style={styles.aboutValue}>学习计划团队</Text>
          </View>
        </View>

        {/* Clear Data */}
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearData}>
          <Text style={styles.clearText}>清除所有数据</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  pointsDisplay: {
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  pointsEmoji: {
    fontSize: 20,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.warning,
  },
  pointsLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  petLevel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  historyList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyLeft: {
    flex: 1,
  },
  historyReason: {
    fontSize: 14,
    color: COLORS.text,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsPositive: {
    color: COLORS.success,
  },
  pointsNegative: {
    color: COLORS.danger,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    fontSize: 15,
    color: COLORS.text,
  },
  settingValue: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  aboutLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  aboutValue: {
    fontSize: 15,
    color: COLORS.textLight,
  },
  clearBtn: {
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.danger + '20',
    borderRadius: 12,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 15,
    color: COLORS.danger,
    fontWeight: '600',
  },
});
